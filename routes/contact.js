const router = require('express').Router();
const { contactToggle, getContacts, } = require('../controller/contact');
const auth = require('../middleware/auth');

router.get('/', auth, getContacts);
router.post('/', auth, contactToggle);

module.exports = router;
