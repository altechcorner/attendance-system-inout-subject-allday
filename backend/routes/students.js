const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('csv'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv(['id_number', 'rfid_number', 'lastname', 'firstname', 'middle_initial', 'course', 'email']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const values = results.map(row => [
        row.id_number,
        row.rfid_number,
        row.lastname,
        row.firstname,
        row.middle_initial,
        row.course,
        row.email
      ]);
      db.query(
        'INSERT IGNORE INTO students (id_number, rfid_number, lastname, firstname, middle_initial, course, email) VALUES ?',
        [values],
        (err, result) => {
          fs.unlinkSync(req.file.path); // Clean up
          if (err) return res.status(500).send('Database error.');
          res.send(`Students uploaded successfully. Total processed: ${values.length}, newly added: ${result.affectedRows}`);
        }
      );
    });
});

router.post('/register', (req, res) => {
  const { id_number, rfid_number, lastname, firstname, middle_initial, course, email } = req.body;
  if (!id_number || !rfid_number || !lastname || !firstname || !middle_initial || !course || !email) {
    return res.status(400).send('All fields are required.');
  }
  const sql = `INSERT INTO students (id_number, rfid_number, lastname, firstname, middle_initial, course, email)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [id_number, rfid_number, lastname, firstname, middle_initial, course, email];
  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('Student already exists.');
      }
      return res.status(500).send('Database error.');
    }
    res.send('Student registered successfully.');
  });
});

module.exports = router;
