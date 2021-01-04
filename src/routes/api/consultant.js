const express = require('express');

const consultantCtrl = require('../../controllers/consultant.controller');

const router = express.Router();

router.get('/:id_process', consultantCtrl.getInformationProcess);
router.get('/', consultantCtrl.getConsultantProcesses);

module.exports = router;
