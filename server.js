// server.js (Node.js + Express + MySQL)
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Change to your MySQL username
  password: '12345',  // Change to your MySQL password
  database: 'patient_portal'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// Create prescriptions table if not exists
const createTable = `CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createTable, (err) => {
  if (err) throw err;
  console.log("✅ Prescriptions table ready.");
});

// Ensure 'uploads' folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload API
app.post('/upload', upload.single('prescription'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const filename = req.file.filename;
  const query = 'INSERT INTO prescriptions (filename) VALUES (?)';

  db.query(query, [filename], (err, result) => {
    if (err) {
      console.error('❌ MySQL error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, filename });
  });
});

// Fetch all uploaded prescriptions
app.get('/api/prescriptions', (req, res) => {
  const query = 'SELECT * FROM prescriptions ORDER BY uploaded_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch:', err);
      return res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});


