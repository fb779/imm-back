const express = require('express');

const consultantCtrl = require('../../controllers/consultant.controller');
const auth = require('./../../middlewares/auth.guard');

const router = express.Router();

// router.post('/assigned', [auth.isAuth], consultantCtrl.setAssignConsultan);
// router.post('/create-process', consultantCtrl.createProcess);
// router.post('/save-form', [auth.isAuth], consultantCtrl.saveForm);
// router.post('/save-consultan', [auth.isAuth], consultantCtrl.setAssignConsultan);
// router.get('/form-process/:id', [auth.isAuth], consultantCtrl.getFormProcess);
// router.get('/assigned-process', [auth.isAuth], consultantCtrl.getProcessesAssigned);
// router.get('/assigned', [auth.isAuth], consultantCtrl.getProcessToAssignan);
// router.get('/:id', [auth.isAuth], consultantCtrl.getProcess);
// router.get('/', [auth.isAuth], consultantCtrl.getProcesses);

router.get('/:id_process', [auth.isAuth], consultantCtrl.getInformationProcess);
router.get('/', [auth.isAuth], consultantCtrl.getConsultantProcesses);

module.exports = router;