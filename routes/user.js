const router = require('express').Router();
const userController = require('../controller/user');
const auth = require('../middleware/auth');

router.get('/:id', auth, userController.getUser);

module.exports = router;
