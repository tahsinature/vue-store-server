const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send('Home');
});

module.exports = router;
