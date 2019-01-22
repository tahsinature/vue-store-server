const router = require('express').Router();
const mediaController = require('../controller/media');

router.post('/', mediaController.uploadMedia);

module.exports = router;
