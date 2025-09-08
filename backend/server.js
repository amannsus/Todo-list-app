const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('../frontend'));

// Routes
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../frontend' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});