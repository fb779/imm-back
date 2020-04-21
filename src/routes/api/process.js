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

// router.post('/assigned', [auth.isAuth], processCtrl.setAssignConsultan);
// router.post('/create-process', processCtrl.createProcess);
// router.post('/save-form', [auth.isAuth], processCtrl.saveForm);
// router.post('/save-consultan', [auth.isAuth], processCtrl.setAssignConsultan);
// router.get('/form-process/:id', [auth.isAuth], processCtrl.getFormProcess);
// router.get('/assigned-process', [auth.isAuth], processCtrl.getProcessesAssigned);
// router.get('/assigned', [auth.isAuth], processCtrl.getProcessToAssignan);


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
router.put('/:id', [], processCtrl.editProcess);
// router.delete('/:id', [], processCtrl.deleteProcess);



module.exports = router;