const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  IP = process.env.IP,
  // logger = require('winston'),
  // errors = require('throw.js'),
  // path = require('path'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  dbUri = process.env.dbUri || 'mongodb://localhost/e-market',
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

app.use('/', indexRoute.home);
app.use('/auth', indexRoute.auth);
app.use('/products', indexRoute.product);
app.use('/cart', indexRoute.cart);
app.use('/media', indexRoute.media);
app.use('/reviews', indexRoute.review);
app.use('/likes', indexRoute.like);
app.use('/chats', indexRoute.chat);
app.use('/contacts', indexRoute.contact);
app.use('/notifications', indexRoute.notification);
app.use((err, req, res, next) => {
  // logger.error(err);
  res.status(err.statusCode || err.status || 500).json(err);
});

const server = app.listen(port, IP, () => {
  const io = require('./socket').init(server);
  io.on('connection', (socket) => {
    console.log('Client Connected');
    socket.on('onReviewMade', (productId, review) => {
      io.emit('onReviewMade', productId, review);
    });
  });
  console.log(`Listening on port: ${port}...`);
  mongoose
    .connect(
      dbUri,
      { useNewUrlParser: true, useCreateIndex: true, }
    )
    .then(() => console.log('Connected to DB'))
    .catch(() => {
      console.log(`DB Connection Failed: ${dbUri}`);
    });
});
