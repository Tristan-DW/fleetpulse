const router = require('express').Router();
const { pool } = require('../config/database');
const { redis } = require('../config/redis');

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM vehicles WHERE status != $1 ORDER BY plate', ['deleted']
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/:id/location', async (req, res, next) => {
  try {
    // Try cache first
    const cached = await redis.get(`location:${req.params.id}`);
    if (cached) return res.json(JSON.parse(cached));

    const { rows } = await pool.query(
      `SELECT lat, lng, speed, heading, recorded_at
       FROM telemetry WHERE vehicle_id = $1
       ORDER BY recorded_at DESC LIMIT 1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No location data' });

    await redis.setex(`location:${req.params.id}`, 10, JSON.stringify(rows[0]));
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.get('/:id/history', async (req, res, next) => {
  try {
    const { from, to, limit = 500 } = req.query;
    const { rows } = await pool.query(
      `SELECT lat, lng, speed, heading, recorded_at
       FROM telemetry
       WHERE vehicle_id = $1
         AND recorded_at BETWEEN COALESCE($2::timestamptz, NOW() - INTERVAL '24h') AND COALESCE($3::timestamptz, NOW())
       ORDER BY recorded_at ASC
       LIMIT $4`,
      [req.params.id, from, to, limit]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
