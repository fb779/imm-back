const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const loginCtrl = require('./../../controllers/loginController');

/************************************************
 *  Login de Usuario
 ************************************************/
router.post('/signin', loginCtrl.signin);

/************************************************
 *  Cerrar la sesion de Usuario
 ************************************************/
router.get('/signout', loginCtrl.signout);

/************************************************
 *  Registro de Usuarios
 ************************************************/
router.post('/signup', loginCtrl.signup);

module.exports = router;