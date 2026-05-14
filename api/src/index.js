const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const debtRoutes = require('./routes/debt.routes');
const investmentRoutes = require('./routes/investment.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/investments', investmentRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'FinLogic API is running successfully' });
});

// Middleware global de errores
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error no controlado:', err);
  }
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;
