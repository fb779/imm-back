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
// router.get('/', userCtrl.getUsers);
// router.get('/:id', userCtrl.getUser);
// router.get('/consultans', userCtrl.getConsultans);
// router.post('/', userCtrl.saveUser);
// router.put('/:id', userCtrl.updateUser);

router.put('/:id', [auth.isAuth], userCtrl.updateUser);
router.post('/', [auth.isAuth], userCtrl.createUser);
router.get('/consultants', [auth.isAuth], userCtrl.getConsultants);
router.get('/:id', [auth.isAuth], userCtrl.getUser);
router.get('/', [auth.isAuth], userCtrl.getListUsers);
// router.get('/', [], userCtrl.getListUsers);



module.exports = router;