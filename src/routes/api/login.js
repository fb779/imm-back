const express = require('express');
const {validResetToken} = require('../../middlewares/auth.guard');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const loginCtrl = require('./../../controllers/login.controller');

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
// router.post('/signup', loginCtrl.signup);

/************************************************
 *  Solicitud de restablecimiento de password
 ************************************************/
router.post('/request-pass', loginCtrl.requestPass);

/************************************************
 *  Restablecimiento de password
 ************************************************/
router.put('/reset-pass', [validResetToken], loginCtrl.resetPass);

module.exports = router;
