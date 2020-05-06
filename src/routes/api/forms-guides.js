/************************************************
 *  Definicion
 ************************************************/
const express = require('express');
// Inicialización
const router = express.Router();

/************************************************
 *  Imports
 ************************************************/
const formsGuidesCtrl = require('../../controllers/forms-guides.controller');
const auth = require('../../middlewares/auth.guard');


/************************************************
 *  Router
 ************************************************/

router.get('/:id_process/:type', [auth.isAuth], formsGuidesCtrl.getFormsGuidesByProcess);
router.delete('/:id_form_guide', [auth.isAuth], formsGuidesCtrl.deleteFormGuideById);
// router.post('/:id_client', [], formsGuidesCtrl.saveDocumentsByCliente);
// router.post('/', [], formsGuidesCtrl.createCliente);
// router.put('/:id', [], formsGuidesCtrl.editCliente);
// router.delete('/:id', [], formsGuidesCtrl.deleteCliente);

module.exports = router;