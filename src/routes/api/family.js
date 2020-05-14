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


router.get('/:id_process', [auth.isAuth], FamilyCtrl.getFamilyByProcess);
router.get('/client/:id_client', [auth.isAuth], FamilyCtrl.getFamilyByClient);
router.post('/:id_process', [auth.isAuth], FamilyCtrl.createFamilyMember);
router.put('/:id_process', [auth.isAuth], FamilyCtrl.editFamilyMember);
router.delete('/:id_process/:id_client', [auth.isAuth], FamilyCtrl.deleteFamilyMember);

module.exports = router;