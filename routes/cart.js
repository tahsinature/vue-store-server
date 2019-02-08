const router = require('express').Router();
const { getCart, saveCart, } = require('../controller/cart');
const auth = require('../middleware/auth');

router.get('/', auth, getCart);
router.post('/', auth, saveCart);

module.exports = router;
