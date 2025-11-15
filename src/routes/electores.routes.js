const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../controllers/elector.controller');

router.get('/mi-info', auth, controller.miInfo);

module.exports = router;
