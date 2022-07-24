//require
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');
const indexRouter = require('./routes');

const app = express();

//port setting
const PORT = 3030;

//engine
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

//squelize
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.error(err);
  });

//middle
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
    },
    name: 'connect.sid',
  })
);

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

//router
app.use('/', indexRouter);

app.get('/upload', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'multipart.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});

app.use((req, res, next) => {
  res.status(404).send('404지롱');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.send('에러용');
});

app.listen(PORT, () => {
  console.log('Server start');
});
