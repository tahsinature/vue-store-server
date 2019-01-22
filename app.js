const express = require('express'),
  app = express(),
  port = 3000,
  // logger = require('winston'),
  // errors = require('throw.js'),
  // path = require('path'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  dbUri = 'mongodb://localhost/e-market',
  indexRoute = require('./routes');

app.use(require('morgan')('tiny'));
app.use(require('cors')());

app.use(express.urlencoded({ extended: true, }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toLocaleString()}-${file.originalname}`);
  },
});
app.use(multer({ storage, }).array('images'));

app.use('/', indexRoute.test);
app.use('/auth', indexRoute.auth);
app.use('/products', indexRoute.product);
app.use('/users', indexRoute.user);
app.use('/media', indexRoute.media);
app.use((err, req, res, next) => {
  // logger.error(err);
  res.status(err.statusCode || err.status || 500).json(err);
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
  mongoose
    .connect(
      dbUri,
      { useNewUrlParser: true, useCreateIndex: true, }
    )
    .then(() => console.log('Connected to DB'))
    .catch(() => {
      console.log('DB Connection Failed');
    });
});
