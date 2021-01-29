const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const userCtrl = require('./../../controllers/users.controller');

/************************************************
 *  get users
 ************************************************/

router.patch('/:id', userCtrl.updateUserPassword);
router.put('/:id', userCtrl.updateUser);
router.post('/', userCtrl.createUser);
router.get('/consultants', userCtrl.getConsultants);
router.get('/valid', userCtrl.getValid);
router.get('/:id', userCtrl.getUser);
router.get('/', userCtrl.getListUsers);

module.exports = router;
