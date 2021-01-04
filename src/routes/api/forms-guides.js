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

/************************************************
 *  Router
 ************************************************/

router.get('/client/:id_client', formsGuidesCtrl.getFormsGuidesByClient);
router.get('/:id_process/:type', formsGuidesCtrl.getFormsGuidesByProcess);
router.get('/:id_form_guide', formsGuidesCtrl.getFormGuideById);
router.delete('/:id_form_guide', formsGuidesCtrl.deleteFormGuideById);

module.exports = router;
