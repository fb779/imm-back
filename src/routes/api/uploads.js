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
router.use(fileUpload({
    createParentPath: true, // crea el las rutas automaticamente
    safeFileNames: true, // elimina caracteres especiales de los nombres
    preserveExtension: 4, // define la cantidad de caracteres de la extension
}));


/************************************************
 * Definicion de rutas
 ************************************************/

router.post('/forms-guides/:id_process', [auth.isAuth], UpController.uploadFormsGuides);
// router.post('/documents/:id_process/:id_document', [], UpController.uploadDocuments);

module.exports = router;