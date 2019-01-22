const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send('Home');
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  res.send('Photo Upload');
});

module.exports = router;
