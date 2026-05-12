const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});
