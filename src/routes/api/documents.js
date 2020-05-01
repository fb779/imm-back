/************************************************
 *  Definicion
 ************************************************/
const express = require('express');
// Inicialización
const router = express.Router();

/************************************************
 *  Imports
 ************************************************/
const documentCtrl = require('./../../controllers/document.controller');
const auth = require('./../../middlewares/auth.guard');


/************************************************
 *  Router
 ************************************************/

router.get('/:id_client', [auth.isAuth], documentCtrl.getDocumentsByCliente);
router.post('/:id_client', [auth.isAuth], documentCtrl.saveDocumentsByCliente);
// router.post('/', [], documentCtrl.createCliente);
// router.put('/:id', [], documentCtrl.editCliente);
// router.delete('/:id', [], documentCtrl.deleteCliente);

module.exports = router;