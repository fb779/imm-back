/********************************************************
 * Definicion
 ********************************************************/
const express = require('express');
// Inicialización
const router = express.Router();

/********************************************************
 *  Importes
 ********************************************************/

const principal = require('./api/principal');
const login = require('./api/login');
const process = require('./api/process');
const consultant = require('./api/consultant');
const users = require('./api/users');
const client = require('./api/client');
const visaCategory = require('./api/visa-category');
const checkList = require('./api/check-list');
const family = require('./api/family');
const documents = require('./api/documents');
const forms_guides = require('./api/forms-guides');
const appointment = require('./api/appointment');
const coupons = require('./api/coupons');
const web_chat = require('./api/web-chat');
const step = require('./api/step');
const uploads = require('./api/uploads');
const static_files = require('./api/static-files');

/********************************************************
 *  Rutas
 ********************************************************/

router.use('/prueba', principal);
router.use('/login', login);
router.use('/users', users);
router.use('/clients', client);
router.use('/process', process);
router.use('/consultant', consultant);
router.use('/visa-category', visaCategory);
router.use('/check-list', checkList);
router.use('/family', family);
router.use('/documents', documents);
router.use('/forms-guides', forms_guides);
router.use('/chat', web_chat);
router.use('/appointment', appointment);
router.use('/coupon', coupons);
router.use('/step', step);

/********************************************************
 * - Carga de archivos (Upload)
 * - Archivos estaticos (Static Files)
 ********************************************************/
// router.use('/api/v1/upload', uploads);
// router.use('/api/v1/', static_files);
router.use('/upload', uploads);
router.use('/', static_files);

module.exports = router;
