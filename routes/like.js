const router = require('express').Router();
const { likeToggle, } = require('../controller/like');
const auth = require('../middleware/auth');
const nonAdmin = require('../middleware/nonAdmin');

router.post('/', auth, nonAdmin, likeToggle);

module.exports = router;
