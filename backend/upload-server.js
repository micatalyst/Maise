import express from 'express';
import cors from 'cors';
import qs from 'qs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSONFilePreset } from 'lowdb/node';

import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => {
  const timestamp = Date.now(); // Obtém o timestamp atual
  const uniqueId = uuidv4(); // Gera um UUID único
  return `${timestamp}-${uniqueId}`; // Combina o UUID com o timestamp
};

const dateFormatter = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

const app = express();
app.use(cors());
const port = 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded());

let db = {};
async function readDb() {
  db = await JSONFilePreset(path.join(__dirname, 'data/db.json'), []);
}
readDb();

// Set up storage location and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let savePath = `uploads/${req.res.locals.newSectionId}`;
    if (file.fieldname === 'file') {
      // default path, already set
      console.log(`Saving file (${file.originalname}) to ${savePath}`);
    } else if (file.fieldname.startsWith('sectionFiles')) {
      const sectionIndex = /sectionFiles\[(\d*)\]/.exec(file.fieldname)[1]; // regex to get the index
      const sectionId = req.body[`sections[${sectionIndex}].id`];
      savePath = `/uploads/${req.res.locals.newSectionId}/audios/${sectionId}`;
      console.log(`Saving section ${sectionId} file (${file.originalname}) to ${savePath}`);
    }
    const uploadPath = path.join(__dirname, savePath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

//
// Global error capture
//
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Outros tipos de erro
    console.error('General Error:', err);
    return res.status(500).json({ message: 'An unknown error occurred.' });
  }
  next();
});

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
app.get('/content', (req, res) => {
  //   await delay(4000);
  res.send(db.data);
});

const getNewSectionId = (req, res, next) => {
  res.locals.newSectionId = generateUniqueId();
  next();
};

// const contentFiles = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'sectionFiles' }]); // not working: MulterError: Unexpected field
const contentFiles = upload.any(); // accept any file (on any field)
app.post('/content', getNewSectionId, contentFiles, async (req, res) => {
  const parsedBody = qs.parse(req.body, { allowDots: true });
  //console.log('parsed body', parsedBody);
  //console.log('File uploaded:', req.file && `/uploads/${res.locals.newSectionId}/${req.file.filename}`);

  // const example = {
  //   id: res.locals.newSectionId,
  //   title: 'Novo!',
  //   description: 'Nova descrição',
  //   content_typology: 'Imagem',
  //   content_category: 'Poster',
  //   language: 'Português',
  //   publish_date: '12-06-2024',
  //   author: 'Miguel Teixeira',
  //   numMecan: 100402,
  //   originalFilePath: `/uploads/${res.locals.newSectionId}/${req.file.filename}`,
  //   saved: false,
  // };

  const originalFilePath = req.files.find((file) => file.fieldname === 'file')?.filename;
  const newContent = {
    ...parsedBody,
    id: res.locals.newSectionId,
    originalFilePath: `/uploads/${res.locals.newSectionId}/${originalFilePath}`,
    publish_date: dateFormatter.format(new Date()),
    saved: false,
    numMecan: Number.parseInt(parsedBody.numMecan, 10),
  };

  // Add audio files path to each section
  newContent.sections.forEach((section, index) => {
    const foundFile = req.files.find((file) => file.fieldname === `sectionFiles[${index}]`)?.filename;
    if (foundFile) {
      section.audioFilePath = `/uploads/${res.locals.newSectionId}/audios/${section.id}/${foundFile}`;
    }
  });
  console.log(newContent);

  db.data.unshift(newContent); // add to the array of contents / local Memory
  // console.log(db.data);
  await db.write(); // write/persist to the file / send to the database
  res.send('Created');
});

app.get('/content/:id', (req, res) => {
  const found = db.data.find((item) => item.id.toString() === req.params.id);
  if (found) {
    res.send(found);
  } else {
    res.send('Not found');
  }
});

app.put('/content/:id', async (req, res) => {
  const found = db.data.find((item) => item.id.toString() === req.params.id);
  if (found) {
    Object.entries(req.body).forEach(([key, value]) => {
      found[key] = value;
    });
    await db.write(); // write/persist to the file / send to the database
    res.send(found);
  } else {
    res.send('Not found');
  }
});

// app.get('/abc', (req, res) => {
//   res.send('Goodbye');
// });

// Handle file upload request
// app.post('/upload', upload.single('file'), (req, res) => {
//   console.log('File uploaded:', req.file);
//   res.send({ filePath: `/uploads/${req.file.filename}` });
// });

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
