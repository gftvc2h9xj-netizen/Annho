CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  steps INTEGER,
  heart_rate INTEGER,
  sleep_hours REAL,
  body_temperature REAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  created_at TIMESTAMP DEFAULT now()
);
