const express = require('express');

const router = express.Router()

/************************************************
 *  Importaciones
 ************************************************/
const clientCtrl = require('./../../controllers/client.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  get users
 ************************************************/

router.get('/', [auth.isAuth], clientCtrl.getClientes);
router.get('/:id', [auth.isAuth], clientCtrl.getClienteId);
router.post('/', [auth.isAuth], clientCtrl.createCliente);
router.put('/:id', [auth.isAuth], clientCtrl.editCliente);
router.delete('/:id', [auth.isAuth], clientCtrl.deleteCliente);

module.exports = router;