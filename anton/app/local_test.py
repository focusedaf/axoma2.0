import cv2
import threading
import time
import os
print("CWD:", os.getcwd())

from dotenv import load_dotenv
from urllib.parse import urlparse
from workers.frame_processor import FrameProcessor
from workers.audio_processor import AudioProcessor

# -----------------------------
# Database Configuration
# -----------------------------

env_path = os.path.join(os.getcwd(), ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)
    print(f"Loaded .env from: {env_path}")
else:
    print(f".env not found at: {env_path}")
DATABASE_URL = os.getenv('DATABASE_URL')

print("Loaded DATABASE_URL:", os.getenv('DATABASE_URL'))
if not DATABASE_URL:
    raise EnvironmentError("DATABASE_URL not found in .env file.")

url = urlparse(DATABASE_URL)
db_config = {
    "host": url.hostname,
    "dbname": url.path[1:],  # remove leading '/'
    "user": url.username,
    "password": url.password,
    "port": url.port or 5432,
}

# -----------------------------
# Shared session ID for both audio & video
# -----------------------------
shared_session_id = f"session_{int(time.time())}"

video_processor = FrameProcessor(db_config=db_config, expected_user="photo1", session_id=shared_session_id)
audio_processor = AudioProcessor(db_config=db_config, session_id=shared_session_id)

print("Session IDs:")
print("Shared:", shared_session_id)

# -----------------------------
# Background Audio Thread
# -----------------------------
AUDIO_CHUNK_SEC = 2
AUDIO_INTERVAL_SEC = 3  # seconds
latest_audio_alerts = []
stop_audio_thread = threading.Event()

def audio_loop():
    """Continuously record and process audio without blocking main thread."""
    global latest_audio_alerts
    while not stop_audio_thread.is_set():
        try:
            report = audio_processor.process_mic(duration_sec=AUDIO_CHUNK_SEC)
            alerts = []
            if report.get("multiple_speakers"):
                alerts.append("MULTIPLE SPEAKERS")
            if report.get("repeated_segments"):
                alerts.append("REPEATED AUDIO")

            latest_audio_alerts = alerts
        except Exception as e:
            print(f"[AudioThread] Error: {e}")

        stop_audio_thread.wait(AUDIO_INTERVAL_SEC)

# Start the background audio thread
audio_thread = threading.Thread(target=audio_loop, daemon=True)
audio_thread.start()

# -----------------------------
# Video Capture Loop
# -----------------------------
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("Failed to open webcam.")

# Reduce resolution for performance
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

print("Press ESC to exit")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        alert_texts = []

        # --- Video Processing ---
        anomalies = video_processor.process_frame(frame)
        for anomaly in anomalies:
            if not anomaly.get("face_visible", True):
                alert_texts.append("NO FACE")
            if anomaly.get("imposter_detected", False):
                alert_texts.append("IMPOSTER DETECTED")
            if anomaly.get("looking_away", False):
                alert_texts.append("LOOKING AWAY")
            if anomaly.get("multiple_faces", False):
                alert_texts.append("MULTIPLE FACES")

        # --- Merge Audio Alerts ---
        alert_texts.extend(latest_audio_alerts)

        # --- Draw Alerts on Frame ---
        if alert_texts:
            cv2.putText(
                frame,
                " | ".join(set(alert_texts)),
                (30, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 0, 255),
                2,
            )

        cv2.imshow("Exam Proctoring Prototype", frame)

        # Exit on ESC
        if cv2.waitKey(1) & 0xFF == 27:
            break

except KeyboardInterrupt:
    print("Keyboard interrupt received, stopping...")

finally:
    # -----------------------------
    # Graceful Shutdown
    # -----------------------------
    stop_audio_thread.set()
    audio_thread.join(timeout=3)
    cap.release()
    cv2.destroyAllWindows()
    video_processor.close()
    audio_processor.close()
    print("✅ Clean exit.")
