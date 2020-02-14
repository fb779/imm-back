const express = require('express');

// Inicialización
const router = express.Router();

const api = require('./api');
// var web = require('./web');

router.use(api);
// router.use(web);

module.exports = router;