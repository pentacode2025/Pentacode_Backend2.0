const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../controllers/mapa.controller');

router.get('/mi-ubicacion', auth, controller.miUbicacion);

module.exports = router;
