const router = require('express').Router();
const { makeReview, removeReview, likeToggleReview, } = require('../controller/review');
const auth = require('../middleware/auth');
const nonAdmin = require('../middleware/nonAdmin');

router.post('/', auth, nonAdmin, makeReview);
router.post('/:id', auth, likeToggleReview);
router.delete('/:id', auth, removeReview);

module.exports = router;
