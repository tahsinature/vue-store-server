const router = require('express').Router();
const { registerUser, loginUser, authenticateUser, } = require('../controller/admin');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/authenticate', authenticateUser);

module.exports = router;
