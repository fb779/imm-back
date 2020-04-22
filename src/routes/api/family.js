const express = require('express');

const router = express.Router()

/************************************************
 *  Importaciones
 ************************************************/
const FamilyCtrl = require('./../../controllers/family.controller');
const auth = require('../../middlewares/auth.guard');

/************************************************
 *  CRUD's especiales
 ************************************************/



/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.get('/:id_process', [], FamilyCtrl.getFamilyByProcess);
// router.get('/:id', [], FamilyCtrl.getFamilyByProcess);
router.post('/:id_process', [], FamilyCtrl.createFamilyMember);
router.put('/:id_process', [], FamilyCtrl.editFamilyMember);
router.delete('/:id_process/:id_client', [], FamilyCtrl.deleteFamilyMember);

module.exports = router;