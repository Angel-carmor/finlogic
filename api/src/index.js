const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'FinLogic API is running successfully' });
});

app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});
