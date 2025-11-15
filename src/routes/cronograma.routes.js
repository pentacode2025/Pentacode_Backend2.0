const express = require('express');
const router = express.Router();
const controller = require('../controllers/cronograma.controller');

router.get('/', controller.listCronograma);

module.exports = router;
