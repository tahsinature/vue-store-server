const express = require('express'),
  app = express(),
  port = 3000,
  mongoose = require('mongoose'),
  dbUri = 'mongodb://localhost/e-market',
  indexRoute = require('./routes');

app.use(require('morgan')('tiny'));

app.use('/products', indexRoute.product);
app.use('/', indexRoute.test);

app.listen(3000, () => {
  console.log(`Listening on port: ${port}...`);
  mongoose
    .connect(
      dbUri,
      { useNewUrlParser: true }
    )
    .then(() => console.log('Connected to DB'))
    .catch(() => {
      console.log('DB Connection Failed');
    });
});
