const router = require('express').Router();
const { pool } = require('../config/database');
const { redis } = require('../config/redis');

// Ingest GPS ping from vehicle device
router.post('/', async (req, res, next) => {
  try {
    const { vehicle_id, lat, lng, speed, heading, recorded_at } = req.body;
    if (!vehicle_id || !lat || !lng) {
      return res.status(400).json({ error: 'vehicle_id, lat, lng required' });
    }

    const ts = recorded_at || new Date().toISOString();

    await pool.query(
      `INSERT INTO telemetry (vehicle_id, lat, lng, speed, heading, recorded_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [vehicle_id, lat, lng, speed ?? null, heading ?? null, ts]
    );

    const payload = JSON.stringify({ vehicle_id, lat, lng, speed, heading, ts });

    // Cache latest position
    await redis.setex(`location:${vehicle_id}`, 30, payload);

    // Broadcast to WebSocket subscribers
    await redis.publish('telemetry:live', payload);

    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
