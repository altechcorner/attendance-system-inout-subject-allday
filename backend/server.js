const express = require('express');
const app = express();
const cors = require('cors');

const studentsRouter = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const subjectsRouter = require('./routes/subjects');
require('./emailCron');

app.use(cors());
app.use(express.json());
app.use('/api/students', studentsRouter);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/subjects', subjectsRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
