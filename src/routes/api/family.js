const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const FamilyCtrl = require('./../../controllers/family.controller');

/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.get('/:id_process', FamilyCtrl.getFamilyByProcess);
router.get('/client/:id_client', FamilyCtrl.getFamilyByClient);
router.get('/user/:id_process', FamilyCtrl.getFamilyByUser);
router.post('/set', FamilyCtrl.setMemberProcess);
router.post('/:id_process', FamilyCtrl.createFamilyMember);
router.put('/:id_process', FamilyCtrl.editFamilyMember);
router.delete('/:id_client', FamilyCtrl.deleteFamilyMember);

module.exports = router;
