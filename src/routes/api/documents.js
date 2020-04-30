const express = require('express');

const router = express.Router()

/************************************************
 *  Importaciones
 ************************************************/
const documentCtrl = require('./../../controllers/document.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  get users
 ************************************************/

router.get('/:id_client', [auth.isAuth], documentCtrl.getDocumentsByCliente);
router.post('/:id_client', [auth.isAuth], documentCtrl.saveDocumentsByCliente);
// router.post('/', [], documentCtrl.createCliente);
// router.put('/:id', [], documentCtrl.editCliente);
// router.delete('/:id', [], documentCtrl.deleteCliente);

module.exports = router;