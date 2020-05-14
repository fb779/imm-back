const express = require('express');
// Inicialización
const router = express.Router();

const path = require('path');
const auth = require('./../../middlewares/auth.guard');

/********************************************************
 * Static Files
 ********************************************************/

router.use('/files', [auth.isAuth], express.static(path.join(__dirname, '..', '..', 'public', 'processes')));

module.exports = router;