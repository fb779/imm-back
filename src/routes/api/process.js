const express = require('express');

/************************************************
 *  Importaciones
 ************************************************/
const processCtrl = require('../../controllers/process.controller');

const router = express.Router();

/************************************************
 *  CRUD basico para el recurso
 ************************************************/
router.get('/:id/form', processCtrl.getProcessIdForm);
router.get('/:id/client', processCtrl.getProcessIdClient);
router.get('/:id', processCtrl.getProcessId);
router.get('/', processCtrl.getProcess);
router.post('/:id/form', processCtrl.createFormProcess);
router.post('/', processCtrl.createProcess);
router.put('/:id/form', processCtrl.editProcessIdForm);
router.put('/:id/step', processCtrl.editStepProcess);
router.put('/:id', processCtrl.editProcess);

module.exports = router;
