# utils/postgres_logger.py
import psycopg2
import time

class PostgresLogger:
    def __init__(self, db_config):
        self.db_config = db_config
        self.conn = psycopg2.connect(**db_config)
        self.cur = self.conn.cursor()
        self._ensure_tables()

    def _ensure_tables(self):
        """Create both tables if they don't exist."""
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS anomalies (
                id SERIAL PRIMARY KEY,
                session_id TEXT,
                frame_id INTEGER,
                timestamp TIMESTAMP,
                recognized_name TEXT,
                expected_user TEXT,
                face_visible BOOLEAN,
                eyes_visible BOOLEAN,
                looking_away BOOLEAN,
                multiple_faces BOOLEAN,
                imposter_detected BOOLEAN
            );
        """)
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS audio_anomalies (
                id SERIAL PRIMARY KEY,
                session_id TEXT,
                timestamp TIMESTAMP,
                source TEXT,
                segment_start REAL,
                segment_end REAL,
                label TEXT,
                multiple_speakers BOOLEAN,
                repeated_hash TEXT
            );
        """)
        self.conn.commit()

    # ----------------- FACE/VIDEO LOGGING -----------------
    def log_anomaly(self, frame_id, name, expected_user,
                    face_visible, eyes_visible, looking_away,
                    multiple_faces, imposter_detected, session_id=None):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        self.cur.execute("""
            INSERT INTO anomalies (
                session_id, frame_id, timestamp, recognized_name, expected_user,
                face_visible, eyes_visible, looking_away, multiple_faces, imposter_detected
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            session_id, frame_id, timestamp, name, expected_user,
            face_visible, eyes_visible, looking_away, multiple_faces, imposter_detected
        ))
        self.conn.commit()

    # ----------------- AUDIO LOGGING -----------------
    def log_audio_anomalies(self, segments, session_id, source, multiple_speakers, repeated_hashes):
        """Log detected audio anomalies."""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        for seg in segments:
            self.cur.execute("""
                INSERT INTO audio_anomalies (
                    session_id, timestamp, source, segment_start,
                    segment_end, label, multiple_speakers, repeated_hash
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                session_id, timestamp, source,
                seg.get("start", 0.0),
                seg.get("end", 0.0),
                seg.get("label", "unknown"),
                multiple_speakers,
                ",".join(repeated_hashes) if repeated_hashes else None
            ))
        self.conn.commit()

    def close(self):
        self.cur.close()
        self.conn.close()
