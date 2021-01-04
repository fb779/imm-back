const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const CheckCtrl = require('./../../controllers/check-list.controller');

/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.get('/', CheckCtrl.getCheckList);
router.get('/:id', CheckCtrl.getCheckListId);
router.get('/valid/:name', CheckCtrl.validName);
router.post('/masive', CheckCtrl.createCheckListMasive);
router.post('/', CheckCtrl.createCheckList);
router.put('/:id', CheckCtrl.editCheckList);
router.delete('/:id', CheckCtrl.deleteCheckList);

module.exports = router;
