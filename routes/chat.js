const router = require('express').Router();
const auth = require('../middleware/auth');
const { getMessage, getChats, sendMessage, } = require('../controller/chat');

router.get('/', auth, getChats);
router.post('/', auth, sendMessage);
router.get('/:id', auth, getMessage);

module.exports = router;
