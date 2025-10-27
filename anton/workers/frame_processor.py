# detectors/frame_processor.py
import cv2
import mediapipe as mp
from detectors.face_recognizer import FaceRecognizer
from detectors.eye_detector import EyeDetector
from detectors.gaze_detector import GazeDetector
from utils.postgres_logger import PostgresLogger
from utils.session_utils import generate_session_id


class FrameProcessor:
    def __init__(self, db_config, expected_user=None, session_id=None):
        # Auto-generate session ID if not provided
        self.session_id = session_id or generate_session_id(prefix="video")

        self.eye_detector = EyeDetector()
        self.gaze_detector = GazeDetector(threshold=0.2)
        self.face_recognizer = FaceRecognizer()
        self.expected_user = expected_user

        # Postgres logger
        self.logger = PostgresLogger(db_config)

        # Mediapipe face detection
        self.mp_face_detection = mp.solutions.face_detection
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=0, min_detection_confidence=0.5
        )

        self.frame_id = 0

    def process_frame(self, frame):
        self.frame_id += 1
        anomalies = []

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_detection.process(rgb_frame)

        face_boxes = []
        h, w, _ = frame.shape
        if results.detections:
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                top = max(int(bbox.ymin * h), 0)
                left = max(int(bbox.xmin * w), 0)
                bottom = min(int((bbox.ymin + bbox.height) * h), h)
                right = min(int((bbox.xmin + bbox.width) * w), w)
                # Use standardized (top, right, bottom, left)
                face_boxes.append((top, right, bottom, left))

        multiple_faces = len(face_boxes) > 1
        recognized_faces = self.face_recognizer.recognize(
            rgb_frame, face_boxes, expected_user=self.expected_user
        )

        if not recognized_faces:
            self._safe_log_anomaly("None", False, False, True, multiple_faces, False)
            anomalies.append({"frame_id": self.frame_id, "reason": "no_face_detected"})
            return anomalies

        for face in recognized_faces:
            name = face["name"]
            expected = face["expected_user"]
            top, right, bottom, left = face["location"]

            # Clamp coordinates to frame bounds
            top, right, bottom, left = max(0, top), min(w, right), min(h, bottom), max(0, left)
            face_img = rgb_frame[top:bottom, left:right]
            face_h, face_w = bottom - top, right - left

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            overlay_text = f"{name} (Expected: {expected})" if expected else name
            cv2.putText(frame, overlay_text, (left, max(top - 10, 0)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            imposter_detected = bool(self.expected_user and name != self.expected_user)

            if face_img.size == 0:
                face_visible = False
                eyes_visible = False
                looking_away = True
            else:
                face_visible = True
                left_eye, right_eye, _ = self.eye_detector.get_eye_landmarks(face_img)
                if left_eye and right_eye:
                    eyes_visible = True
                    left_center = self.eye_detector.compute_eye_center(left_eye)
                    right_center = self.eye_detector.compute_eye_center(right_eye)
                    # Pass face_img dimensions for gaze detection
                    looking_away = self.gaze_detector.is_looking_away(left_center, right_center, face_w, face_h)
                else:
                    eyes_visible = False
                    looking_away = True

            if not face_visible or not eyes_visible or looking_away or imposter_detected or multiple_faces:
                self._safe_log_anomaly(name, face_visible, eyes_visible, looking_away, multiple_faces, imposter_detected)
                anomalies.append({
                    "frame_id": self.frame_id,
                    "name": name,
                    "expected_user": expected,
                    "face_visible": face_visible,
                    "eyes_visible": eyes_visible,
                    "looking_away": looking_away,
                    "multiple_faces": multiple_faces,
                    "imposter_detected": imposter_detected
                })

        return anomalies

    def _safe_log_anomaly(self, name, face_visible, eyes_visible, looking_away, multiple_faces, imposter_detected):
        """Log anomaly with safety against DB exceptions."""
        try:
            self.logger.log_anomaly(
                self.frame_id, name, self.expected_user,
                face_visible, eyes_visible, looking_away,
                multiple_faces, imposter_detected,
                session_id=self.session_id
            )
        except Exception as e:
            print(f"[FrameProcessor] Logging error: {e}")

    def close(self):
        self.face_detection.close()
        self.logger.close()
