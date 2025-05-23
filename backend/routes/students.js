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
    .pipe(csv(['id_number', 'name', 'email']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const values = results.map(row => [row.id_number, row.name, row.email]);
      db.query(
        'INSERT IGNORE INTO students (id_number, name, email) VALUES ?',
        [values],
        (err) => {
          fs.unlinkSync(req.file.path); // Clean up
          if (err) return res.status(500).send('Database error.');
          res.send('Students uploaded successfully.');
        }
      );
    });
});

module.exports = router;
