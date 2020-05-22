/********************************************************
 * Definicion
 ********************************************************/
const { Router } = require('express');

const WooCommerceCtrl = require('../controllers/woocommerce.controller');

// Inicialización
const router = Router();

/************************************************
 *  Especial routes
 ************************************************/
router.post('/woocommerce', WooCommerceCtrl.postWoocommerceWebhook);

/************************************************
 *  esport de las rutas
 ************************************************/
module.exports = router;