const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'HEALTH_DB',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/api/services', (req, res) => {
    db.query('SELECT * FROM SERVICES', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results)
    })
});

app.post('/api/services', (req, res) => {
  const { name, endpoint, status = 'Healthy' } = req.body;
  db.query(
    'INSERT INTO SERVICES (name, endpoint, status) VALUES (?, ?, ?)',
    [name, endpoint, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, endpoint, status });
    }
  );
});

app.get('/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).json({ status: 'DOWN', db: 'Disconnected' });
    res.status(200).json({ status: 'UP', db: 'Connected', timestamp: new Date() });
  });
});

app.get('/metrics', (req, res) => {
  res.type('text/plain');
  res.send(`# HELP app_uptime_seconds Total app uptime\napp_uptime_seconds ${process.uptime()}\n`);
});

const PORT = 8010;
app.listen(PORT, () => console.log(`App running on Port: ${PORT}`));