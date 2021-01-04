const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const clientCtrl = require('./../../controllers/client.controller');

/************************************************
 *  get users
 ************************************************/

router.get('/', clientCtrl.getClientes);
router.get('/:id', clientCtrl.getClienteId);
router.post('/', clientCtrl.createCliente);
router.put('/:id', clientCtrl.editCliente);
router.delete('/:id', clientCtrl.deleteCliente);

module.exports = router;
