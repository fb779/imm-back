const express = require('express');


// Inicialización
const router = express.Router();

/********************************************************
 *  Rutas
 ********************************************************/

// const api = require('./api/principal');
const login = require('./api/login');
const process = require('./api/process');
const users = require('./api/users');

router.use('/api/v1/login', login);
router.use('/api/v1/users', users);
router.use('/api/v1/process', process);

module.exports = router;