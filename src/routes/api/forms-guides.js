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

router.get('/client/:id_client', [auth.isAuth], formsGuidesCtrl.getFormsGuidesByClient);
router.get('/:id_process/:type', [auth.isAuth], formsGuidesCtrl.getFormsGuidesByProcess);
router.get('/:id_form_guide', [auth.isAuth], formsGuidesCtrl.getFormGuideById);
router.delete('/:id_form_guide', [auth.isAuth], formsGuidesCtrl.deleteFormGuideById);

module.exports = router;