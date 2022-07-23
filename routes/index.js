const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('새로운 폴더 uploads 생성');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', (req, res) => {
  req.cookies;
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

router.get('/upload', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'multipart.html'));
});

router.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});

module.exports = router;
