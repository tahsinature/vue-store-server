const router = require('express').Router();
const auth = require('../middleware/auth');
const { getNotifications, markAsRead, deleteNotifications, } = require('../controller/notification');

router.get('/', auth, getNotifications);
router.put('/', auth, markAsRead);
router.delete('/', auth, deleteNotifications);

module.exports = router;
