const express = require('express');

const processCtrl = require('../../controllers/processController');

const router = express.Router();

router.post('/create-process', processCtrl.createProcess);
router.get('/', processCtrl.getProcesses);
router.get('/:id', processCtrl.getProcess);

module.exports = router;