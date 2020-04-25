const express = require('express');
const path = require('path');
const auth = require('./../../middlewares/auth.guard');

// Inicialización
const router = express.Router();

/********************************************************
 * Static Files
 ********************************************************/

router.use('/documents', [auth.isAuth], express.static(path.join(__dirname, '..', '..', 'public', 'processes')));

// app.use('/documents', express.static(path.join(__dirname, 'public')));

module.exports = router;