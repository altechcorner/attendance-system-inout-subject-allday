const express = require('express');
const router = express.Router();
const db = require('../db');

// Register a new subject
router.post('/register', (req, res) => {
  const { subject_code, subject_description } = req.body;
  if (!subject_code || !subject_description) {
    return res.status(400).send('All fields are required.');
  }
  db.query(
    'INSERT INTO subjects (subject_code, subject_description) VALUES (?, ?)',
    [subject_code, subject_description],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('Subject already exists.');
        }
        console.error('Database error:', err); // Log the actual error
        return res.status(500).send('Database error.');
      }
      res.send('Subject registered successfully.');
    }
  );
});

// Get all subjects
router.get('/', (req, res) => {
  const { code } = req.query;
  if (code) {
    db.query('SELECT * FROM subjects WHERE subject_code = ?', [code], (err, results) => {
      if (err) return res.status(500).send('Database error.');
      res.json(results);
    });
  } else {
    db.query('SELECT * FROM subjects', (err, results) => {
      if (err) return res.status(500).send('Database error.');
      res.json(results);
    });
  }
});

module.exports = router;