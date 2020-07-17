const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const CheckCtrl = require('./../../controllers/check-list.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  CRUD's especiales
 ************************************************/

/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.get('/', [auth.isAuth], CheckCtrl.getCheckList);
router.get('/:id', [auth.isAuth], CheckCtrl.getCheckListId);
router.get('/valid/:name', [auth.isAuth], CheckCtrl.validName);
router.post('/masive', [auth.isAuth], CheckCtrl.createCheckListMasive);
router.post('/', [auth.isAuth], CheckCtrl.createCheckList);
router.put('/:id', [auth.isAuth], CheckCtrl.editCheckList);
router.delete('/:id', [auth.isAuth], CheckCtrl.deleteCheckList);

module.exports = router;
