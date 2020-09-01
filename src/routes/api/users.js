const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const userCtrl = require('./../../controllers/users.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  get users
 ************************************************/
router.use([auth.isAuth]);
router.patch('/:id', userCtrl.updateUserPassword);
router.put('/:id', userCtrl.updateUser);
router.post('/', userCtrl.createUser);
router.get('/consultants', userCtrl.getConsultants);
router.get('/valid', userCtrl.getValid);
router.get('/:id', userCtrl.getUser);
router.get('/', userCtrl.getListUsers);

module.exports = router;
