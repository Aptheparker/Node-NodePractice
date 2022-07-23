//require
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { urlencoded } = require('express');

const app = express();

//port setting
const PORT = 3030;

//middle
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'apapap',
    cookie: {
      httpOnly: true,
    },
    name: 'connect.sid',
  })
);
app.use('/', (req, res, next) => {
  if (req.session.id) {
    express.static(path.join(__dirname, 'public'))(req, res, next);
  } else {
    next();
  }
});
app.use(express.json());
app.use(urlencoded({ extended: true }));

//router
app.get('/', (req, res) => {
  req.cookies;
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.status(200).send('about express');
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
