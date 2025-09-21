const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const StudentSchema = new mongoose.Schema({
  name: String,
  grade: String,
  status: { type: String, enum: ['Generated', 'Pending'], default: 'Pending' },
  marks: {
    midterm: Number,
    final: Number,
    assignment: Number
  }
});

const FacultySchema = new mongoose.Schema({
  name: String,
  department: String
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String, // Note: In production, you should hash passwords
  role: { type: String, enum: ['admin', 'faculty'] }
});

// Models
const Student = mongoose.model('Student', StudentSchema);
const Faculty = mongoose.model('Faculty', FacultySchema);
const User = mongoose.model('User', UserSchema);

// Routes

// Login (simplified without JWT)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email, password }); // Simple check - in production, use hashed passwords
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Student Routes
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.put('/api/students/:id/marks', async (req, res) => {
  try {
    const { midterm, final, assignment } = req.body;
    const average = (midterm + final + assignment) / 3;
    
    let grade = '';
    if (average >= 90) grade = 'A';
    else if (average >= 80) grade = 'B+';
    else if (average >= 70) grade = 'B';
    else if (average >= 60) grade = 'C';
    else grade = 'F';
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        marks: { midterm, final, assignment },
        grade,
        status: 'Generated'
      },
      { new: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).send('Student not found');
    }
    
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Faculty Routes
app.get('/api/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/faculty', async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});