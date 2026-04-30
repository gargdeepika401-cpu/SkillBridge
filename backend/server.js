const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// Database connection
const db = require('./src/config/db');

// Test database connection
db.query('SELECT 1')
  .then(() => {
    console.log('MySQL database connected successfully');
  })
  .catch((err) => {
    console.log('Database connection failed:', err.message);
  });

app.get('/', (req, res) => {
  res.json({
    message: 'SkillBridge API is running',
    status: 'OK'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});