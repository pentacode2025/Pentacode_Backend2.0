const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/verificar-elector', controller.verificarElector);

module.exports = router;
