const express = require('express');

const router = express.Router()

/************************************************
 *  Importaciones
 ************************************************/
const userCtrl = require('./../../controllers/users.controller');
const auth = require('./../../middlewares/auth.guard')

/************************************************
 *  get users
 ************************************************/
router.put('/:id', [auth.isAuth], userCtrl.updateUser);
router.post('/', [auth.isAuth], userCtrl.createUser);
router.get('/consultants', [auth.isAuth], userCtrl.getConsultants);
router.get('/:id', [auth.isAuth], userCtrl.getUser);
router.get('/', [auth.isAuth], userCtrl.getListUsers);

module.exports = router;