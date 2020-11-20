const express = require('express');

// Inicialización
const router = express.Router();

const api = require('./api');
const woo = require('./woocomerce');
// var web = require('./web');

router.use('/api/v1', api);
router.use(woo);
// router.use(web);

module.exports = router;
