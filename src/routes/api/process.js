const express = require('express');

/************************************************
 *  Importaciones
 ************************************************/
const processCtrl = require('../../controllers/process.controller');
const auth = require('./../../middlewares/auth.guard');

const router = express.Router();

/************************************************
 *  CRUD's especiales
 ************************************************/

/************************************************
 *  CRUD basico para el recurso
 ************************************************/
router.get('/:id/form', [auth.isAuth], processCtrl.getProcessIdForm);
router.get('/:id/client', [auth.isAuth], processCtrl.getProcessIdClient);
router.get('/:id', [auth.isAuth], processCtrl.getProcessId);
router.get('/', [auth.isAuth], processCtrl.getProcess);
router.post('/:id/form', [auth.isAuth], processCtrl.createFormProcess);
router.post('/', [auth.isAuth], processCtrl.createProcess);
router.put('/:id/form', [auth.isAuth], processCtrl.editProcessIdForm);
router.put('/:id/step', [auth.isAuth], processCtrl.editStepProcess);
router.put('/:id', [auth.isAuth], processCtrl.editProcess);

module.exports = router;
