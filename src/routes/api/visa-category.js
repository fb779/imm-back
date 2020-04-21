const express = require('express');

const router = express.Router()

/************************************************
 *  Importaciones
 ************************************************/
const visaCategoryCtrl = require('./../../controllers/visa-category.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  CRUD's especiales
 ************************************************/



/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.get('/', [], visaCategoryCtrl.getVisaCateories);
router.get('/:id', [], visaCategoryCtrl.getVisaCateoryId);
router.post('/', [], visaCategoryCtrl.createVisaCateory);
router.put('/:id', [], visaCategoryCtrl.editVisaCateory);
router.delete('/:id', [], visaCategoryCtrl.deleteVisaCateory);



module.exports = router;