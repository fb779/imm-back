/************************************************
 *  Definicion
 ************************************************/
const express = require('express');

/************************************************
 *  Imports
 ************************************************/
const fileUpload = require('express-fileupload');

const UpController = require('../../controllers/upload.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 * Inicialización
 ************************************************/

const router = express.Router();

/************************************************
 * Configuracion del middleware fileUpload
 ************************************************/
router.use(
  fileUpload({
    createParentPath: true, // crea el las rutas automaticamente
    safeFileNames: true, // elimina caracteres especiales de los nombres
    preserveExtension: 4, // define la cantidad de caracteres de la extension
    parseNested: false, // deshabilitacion por verificacion de seguridad (atacqued DoS e inyeccion de codigo)
  })
);

/************************************************
 * Definicion de rutas
 ************************************************/

router.post('/forms-guides/:id_process', [auth.isAuth], UpController.uploadFormsGuides);
router.post('/documents/:id_document', [auth.isAuth], UpController.uploadDocuments);

module.exports = router;
