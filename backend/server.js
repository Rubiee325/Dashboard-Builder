const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Attach IO to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Final Robust Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  
  if (err.name === 'ValidationError') {
    const errorMessages = {};
    if (err.errors) {
        for (const key in err.errors) {
            errorMessages[key] = err.errors[key].message || 'Please fill the field';
        }
    }
    return res.status(400).json({ errors: errorMessages });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/custom_dashboard_builder';
const PORT = process.env.PORT || 5050;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('✅ DATABASE CONNECTED');
  server.listen(PORT, () => console.log('🚀 SERVER RUNNING ON ' + PORT));
}).catch(err => {
  console.error('❌ DB CONNECTION FAILED:', err.message);
});
