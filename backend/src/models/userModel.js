const db = require('../config/db');

// Find a user by email
const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Create a new user
const create = async (name, email, hashedPassword, role) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result;
};

// Update a user's password
const updatePassword = async (email, hashedPassword) => {
  const [result] = await db.query(
    'UPDATE users SET password = ? WHERE email = ?',
    [hashedPassword, email]
  );
  return result;
};

module.exports = { findByEmail, create, updatePassword };