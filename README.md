<div align="center">

<img src="https://skillicons.dev/icons?i=react,ts,nodejs,postgres,redis,flutter,docker,aws" />

<br/>

![GitHub last commit](https://img.shields.io/github/last-commit/Tristan-DW/fleetpulse?style=for-the-badge&color=6e40c9)
![GitHub stars](https://img.shields.io/github/stars/Tristan-DW/fleetpulse?style=for-the-badge&color=f0883e)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-238636?style=for-the-badge)

# fleetpulse

> **Full-stack fleet tracking platform - React web dashboard, Flutter mobile app, Node.js API, PostgreSQL, Redis, WebSockets.**

</div>

---

## Overview

**fleetpulse** is a production-grade fleet management and tracking platform. Vehicle locations stream live via WebSockets, drivers are managed through a REST API, and the platform ships both a React web dashboard and a Flutter mobile app for dispatchers and drivers in the field. Deployed on AWS with Docker and a full CI/CD pipeline.

---

## Features

| Feature | Description |
|---|---|
| **Live Tracking** | Vehicle positions pushed via WebSockets every 5s, cached in Redis |
| **React Dashboard** | Web UI with live map (Leaflet), stat cards, tables, and alerts |
| **Flutter Mobile App** | Cross-platform driver and dispatcher app (iOS + Android) |
| **Driver Management** | CRUD for drivers, assignments, and shift history |
| **Route Planning** | Create and assign routes with waypoints |
| **Trip History** | Full logs in PostgreSQL with time-indexed telemetry |
| **Alerts** | Configurable alerts for speeding, idle time, geofence breaches |
| **AWS Deployment** | ECS + RDS + ElastiCache + S3 + CloudFront |

---

## Architecture

```
Flutter App  React Dashboard
     |              |
     +----[ REST API + WebSocket Server (Node.js) ]----+
                        |                              |
                   PostgreSQL                    Redis (pub/sub + cache)
                        |
               AWS RDS + ElastiCache
```

---

## Quick Start

```bash
git clone https://github.com/Tristan-DW/fleetpulse.git
cd fleetpulse

cp .env.example .env
docker-compose up -d

# API
cd server && npm install && npm run migrate && npm run dev

# Web dashboard
cd client && npm install && npm run dev

# Mobile app
cd mobile && flutter pub get && flutter run
```

---

## Project Structure

```
fleetpulse/
├── client/             # React + TypeScript web dashboard
│   └── src/
│       ├── components/ # VehicleMap, StatCard, DataTable
│       ├── hooks/      # useVehicleTracking (WebSocket)
│       └── pages/      # Dashboard, Vehicles, Drivers, Routes
├── mobile/             # Flutter mobile app
│   └── lib/
│       ├── screens/    # MapScreen, VehicleList, DriverApp
│       ├── services/   # WebSocket, API client
│       └── models/
├── server/             # Node.js + Express API
│   ├── src/
│   │   ├── routes/     # vehicles, drivers, routes, telemetry
│   │   └── services/   # tracking, telemetry ingest
│   └── migrations/
├── docker-compose.yml
└── .github/workflows/  # CI + AWS ECS deploy
```

---

## Database Schema

```sql
CREATE TABLE vehicles (
  id        SERIAL PRIMARY KEY,
  plate     VARCHAR(20) UNIQUE NOT NULL,
  make      VARCHAR(100),
  model     VARCHAR(100),
  status    VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE telemetry (
  id          BIGSERIAL PRIMARY KEY,
  vehicle_id  INTEGER REFERENCES vehicles(id),
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  speed       REAL,
  recorded_at TIMESTAMPTZ NOT NULL
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
