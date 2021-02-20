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

/************************************************
 *  Router
 ************************************************/
router.get('/', documentCtrl.getDocuments);
router.get('/:id_process/:id_client', documentCtrl.getDocumentsByProcessClient);
router.get('/:id_client', documentCtrl.getDocumentsByCliente);
router.post('/list', documentCtrl.getDocumentsByProcess);
router.post('/:id_client', documentCtrl.saveDocumentsByCliente);
router.put('/:id_document', documentCtrl.updateStatusDocument);

module.exports = router;
