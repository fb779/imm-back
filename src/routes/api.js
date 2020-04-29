const express = require('express');
const path = require('path');


// Inicialización
const router = express.Router();

/********************************************************
 *  Rutas
 ********************************************************/

// const api = require('./api/principal');
const login = require('./api/login');
const process = require('./api/process');
const consultant = require('./api/consultant');
const users = require('./api/users');
const client = require('./api/client');
const visaCategory = require('./api/visa-category');
const checkList = require('./api/check-list');
const family = require('./api/family');
const documents = require('./api/documents');

router.use('/api/v1/login', login);
router.use('/api/v1/users', users);
router.use('/api/v1/clients', client);
router.use('/api/v1/process', process);
router.use('/api/v1/consultant', consultant);
router.use('/api/v1/visa-category', visaCategory);
router.use('/api/v1/check-list', checkList);
router.use('/api/v1/family', family);
router.use('/api/v1/documents', documents);
// router.use('/api/v1/documents', express.static(path.join(__dirname, '..', 'public')));
module.exports = router;