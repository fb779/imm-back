const express = require('express');

const processCtrl = require('../../controllers/processController');
const auth = require('./../../middlewares/auth.guard');

const router = express.Router();

router.post('/create-process', processCtrl.createProcess);
router.post('/save-form', [auth.isAuth], processCtrl.saveForm);
router.post('/save-consultan', [auth.isAuth], processCtrl.setAssignConsultan);
router.get('/form-process/:id', [auth.isAuth], processCtrl.getFormProcess);
router.get('/asigned', [auth.isAuth], processCtrl.getProcessToAssignan);
router.get('/:id', [auth.isAuth], processCtrl.getProcess);
router.get('/', [auth.isAuth], processCtrl.getProcesses);

module.exports = router;