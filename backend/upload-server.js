import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
app.use(cors());
const port = 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

let db = {};
async function readDb() {
  db = await JSONFilePreset('data/db.json', []);
}
readDb();

// Set up storage location and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
app.get('/content', async (req, res) => {
  //   await delay(4000);
  res.send(db.data);
});

app.get('/content/:id', (req, res) => {
  const found = db.data.find((item) => item.id.toString() === req.params.id);
  if (found) {
    res.send(found);
  } else {
    res.send('Not found');
  }
});

// app.get('/abc', (req, res) => {
//   res.send('Goodbye');
// });

// Handle file upload request
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded:', req.file);
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
