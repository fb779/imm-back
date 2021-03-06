const express = require('express');

const router = express.Router()

/************************************************
 *  Importaciones
 ************************************************/
const userCtrl = require('./../../controllers/usersController');
const auth = require('./../../middlewares/auth.guard')

/************************************************
 *  get users
 ************************************************/
router.get('/', [auth.isAuth], userCtrl.getUsers);
router.get('/:id', [auth.isAuth], userCtrl.getUser);
router.post('/', [auth.isAuth], userCtrl.saveUser);
router.put('/:id', [auth.isAuth], userCtrl.updateUser);

module.exports = router;