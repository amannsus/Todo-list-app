const express = require('express');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const taskRoutes = require('./routes/tasks');

const app = express();

// Connect to MongoDB first
connectDB();

// Middleware
app.use(require('./middleware/cors'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend (same origin)
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/tasks', taskRoutes);

// Root HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Auto-select port and handle EADDRINUSE
const BASE_PORT = Number(process.env.PORT) || 3000;
const MAX_TRIES = 10;

function start(port, n = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && n < MAX_TRIES) {
      const next = port + 1;
      console.warn(`Port ${port} in use, retrying on ${next}...`);
      setTimeout(() => start(next, n + 1), 200);
    } else {
      console.error('Failed to bind port:', err);
      process.exit(1);
    }
  });
}

start(BASE_PORT);
