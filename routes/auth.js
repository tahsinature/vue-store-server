const router = require('express').Router();
const {
  checkAvailablity,
  registerUser,
  loginUser,
  authenticateUser,
  getUser,
  editUser,
} = require('../controller/admin');
const auth = require('../middleware/auth');

router.get('/', checkAvailablity);
router.put('/', auth, editUser);
router.get('/:id', auth, getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/authenticate', authenticateUser);

module.exports = router;
