const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const visaCategoryCtrl = require('./../../controllers/visa-category.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.get('/', [auth.isAuth], visaCategoryCtrl.getVisaCateories);
router.get('/:id', [auth.isAuth], visaCategoryCtrl.getVisaCateoryId);
router.get('/valid-name/:name', [auth.isAuth], visaCategoryCtrl.validName);
router.post('/', [auth.isAuth], visaCategoryCtrl.createVisaCateory);
router.put('/:id', [auth.isAuth], visaCategoryCtrl.editVisaCateory);
router.delete('/:id', [auth.isAuth], visaCategoryCtrl.deleteVisaCateory);

module.exports = router;
