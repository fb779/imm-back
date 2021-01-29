/************************************************
 *  Definicion
 ************************************************/
const express = require('express');

/************************************************
 *  Imports
 ************************************************/
const StepCtrl = require('../../controllers/step.controller');

/************************************************
 * Inicialización
 ************************************************/

const router = express.Router();

/************************************************
 * Definicion de rutas
 ************************************************/

router.get('/', [], StepCtrl.getStepList);
router.get('/valid', [], StepCtrl.validStepName);
router.get('/:id', [], StepCtrl.getStepId);
router.post('/', [], StepCtrl.createStep);
router.put('/:id', [], StepCtrl.editStep);
router.delete('/:id', [], StepCtrl.deleteStep);

/************************************************
 * export de rutas
 ************************************************/
module.exports = router;
