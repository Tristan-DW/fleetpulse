<div align="center">

<img src="https://skillicons.dev/icons?i=react,ts,nodejs,postgres,redis,docker" />

<br/>

![GitHub last commit](https://img.shields.io/github/last-commit/Tristan-DW/fleetpulse?style=for-the-badge&color=6e40c9)
![GitHub stars](https://img.shields.io/github/stars/Tristan-DW/fleetpulse?style=for-the-badge&color=f0883e)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-238636?style=for-the-badge)

# fleetpulse

> **Full-stack fleet tracking dashboard - React, Node.js, PostgreSQL, WebSockets, and real-time maps.**

</div>

---

## Overview

**fleetpulse** is a production-grade fleet management and tracking platform. Vehicle locations stream in via WebSockets in real time, drivers and routes are managed through a clean REST API, and a React + TypeScript dashboard displays live maps, analytics, and alerts. Built on the same architecture patterns used in large-scale logistics systems.

---

## Features

| Feature | Description |
|---|---|
| **Live Tracking** | Vehicle positions pushed via WebSockets, updated every 5s |
| **Driver Management** | CRUD API for drivers, assignments, and shift history |
| **Route Planning** | Create and assign routes with waypoints |
| **Trip History** | Full trip logs stored in PostgreSQL with geospatial queries |
| **Alerts** | Configurable alerts for speeding, idle time, and geofence breaches |
| **Analytics** | Distance, fuel efficiency, and utilization dashboards |
| **Auth** | JWT-based auth with role separation (admin, dispatcher, driver) |
| **Docker** | Full dev stack in a single `docker-compose up` |

---

## Architecture

```
                    REST API (Express)
                         |
Browser (React) ----  API Gateway  ---- PostgreSQL
                         |
                    WebSocket Server
                         |
                      Redis (pub/sub + cache)
                         |
                    GPS Ingest Service
```

---

## Quick Start

```bash
git clone https://github.com/Tristan-DW/fleetpulse.git
cd fleetpulse

cp .env.example .env
docker-compose up -d

# Backend
cd server && npm install && npm run migrate && npm run dev

# Frontend
cd client && npm install && npm run dev
```

- API: `http://localhost:3000`
- Dashboard: `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Login | No |
| `GET` | `/vehicles` | List all vehicles | Yes |
| `GET` | `/vehicles/:id/location` | Latest GPS position | Yes |
| `GET` | `/vehicles/:id/history` | Trip history | Yes |
| `GET` | `/drivers` | List drivers | Yes |
| `POST` | `/drivers` | Create driver | Admin |
| `GET` | `/routes` | List routes | Yes |
| `POST` | `/routes` | Create route | Dispatcher |
| `POST` | `/telemetry` | Ingest GPS ping | Device token |
| `GET` | `/analytics/utilization` | Fleet utilization stats | Yes |
| `GET` | `/health` | Health check | No |

---

## Project Structure

```
fleetpulse/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Dashboard, Vehicles, Drivers, Routes
│   │   ├── hooks/          # useWebSocket, useVehicles, useAuth
│   │   ├── api/            # API client
│   │   └── types/
│   ├── package.json
│   └── tailwind.config.ts
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── tracking.js # WebSocket + Redis bridge
│   │   │   └── telemetry.js
│   │   └── app.js
│   ├── migrations/
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Database Schema

```sql
-- Core tables
CREATE TABLE vehicles (
  id           SERIAL PRIMARY KEY,
  plate        VARCHAR(20) UNIQUE NOT NULL,
  make         VARCHAR(100),
  model        VARCHAR(100),
  year         INTEGER,
  status       VARCHAR(20) DEFAULT 'active',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drivers (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  license_no   VARCHAR(50),
  status       VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE telemetry (
  id           BIGSERIAL PRIMARY KEY,
  vehicle_id   INTEGER REFERENCES vehicles(id),
  lat          DOUBLE PRECISION NOT NULL,
  lng          DOUBLE PRECISION NOT NULL,
  speed        REAL,
  heading      REAL,
  recorded_at  TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_telemetry_vehicle_time ON telemetry(vehicle_id, recorded_at DESC);
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

<div align="center">

<sub>Architected by <a href="https://github.com/Tristan-DW">Tristan</a> - Head Architect</sub>

</div>
