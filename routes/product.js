const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send('Products');
});

module.exports = router;
