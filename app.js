//require
const express = require('express');
const path = require('path');
const app = express();

//port setting
const PORT = 3030;

app.use((req, res, next) => {
  console.log('Running...');
  next();
});

//router
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.send('about express');
});

app.use((req, res, next) => {
  res.send('404지롱');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.send('에러용');
});

app.listen(PORT, () => {
  console.log('Server start');
});
