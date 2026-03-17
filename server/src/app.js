const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { redis, redisSub } = require('./config/redis');

const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const routeRoutes = require('./routes/routes');
const telemetryRoutes = require('./routes/telemetry');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vehicles', authenticate, vehicleRoutes);
app.use('/drivers', authenticate, driverRoutes);
app.use('/routes', authenticate, routeRoutes);
app.use('/telemetry', telemetryRoutes);
app.use('/analytics', authenticate, analyticsRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));
app.use(errorHandler);

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const clients = new Map();

wss.on('connection', (ws, req) => {
  const id = Math.random().toString(36).slice(2);
  clients.set(id, ws);
  ws.on('close', () => clients.delete(id));
});

// Broadcast live telemetry from Redis pub/sub
redisSub.subscribe('telemetry:live');
redisSub.on('message', (_channel, message) => {
  for (const ws of clients.values()) {
    if (ws.readyState === ws.OPEN) ws.send(message);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`fleetpulse server on :${PORT}`));
