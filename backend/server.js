const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

// Middleware for large files
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ extended: true, limit: '2gb' }));

// Optional: timeout handling
app.use((req, res, next) => {
  res.setTimeout(15 * 60 * 1000, () => {
    console.log('Request timed out');
    res.status(408).send('Request timeout');
  });
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Schema and model
const fileSchema = new mongoose.Schema({
  name: String,
  fileName: String,
  date: { type: Date, default: Date.now },
  randomNumber: { type: String, unique: true },
});
const File = mongoose.model('File', fileSchema, 'filez');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 } }); // 1GB

// Upload route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { name } = req.body;
  const randomNumber = Math.floor(Math.random() * 900000 + 100000).toString();

  try {
    const newFile = new File({ name, fileName: req.file.filename, randomNumber });
    await newFile.save();
    res.status(200).json({ random_number: randomNumber });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Search route
app.get('/api/search/:randomNumber', async (req, res) => {
  try {
    const file = await File.findOne({ randomNumber: req.params.randomNumber });
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.status(200).json(file);
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ error: 'Error fetching file' });
  }
});

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
