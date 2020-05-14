const express = require('express');

const consultantCtrl = require('../../controllers/consultant.controller');
const auth = require('./../../middlewares/auth.guard');

const router = express.Router();

router.get('/:id_process', [auth.isAuth], consultantCtrl.getInformationProcess);
router.get('/', [auth.isAuth], consultantCtrl.getConsultantProcesses);

module.exports = router;