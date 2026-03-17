-- up
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255),
  role          VARCHAR(50) DEFAULT 'dispatcher',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id         SERIAL PRIMARY KEY,
  plate      VARCHAR(20) UNIQUE NOT NULL,
  make       VARCHAR(100),
  model      VARCHAR(100),
  year       INTEGER,
  status     VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  license_no   VARCHAR(50),
  vehicle_id   INTEGER REFERENCES vehicles(id),
  status       VARCHAR(20) DEFAULT 'active',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  waypoints   JSONB,
  vehicle_id  INTEGER REFERENCES vehicles(id),
  driver_id   INTEGER REFERENCES drivers(id),
  status      VARCHAR(20) DEFAULT 'planned',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry (
  id          BIGSERIAL PRIMARY KEY,
  vehicle_id  INTEGER NOT NULL REFERENCES vehicles(id),
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  speed       REAL,
  heading     REAL,
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time ON telemetry(vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_vehicle ON drivers(vehicle_id);

-- down
DROP TABLE IF EXISTS telemetry;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;
