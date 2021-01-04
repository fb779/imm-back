/************************************************
 *  Definicion
 ************************************************/
const express = require('express');

/************************************************
 *  Imports
 ************************************************/
const WebChatController = require('../../controllers/web-chat.controller');

/************************************************
 * Inicialización
 ************************************************/

const router = express.Router();

/************************************************
 * Definicion de rutas
 ************************************************/

router.post('/', WebChatController.createMessage);
router.get('/:id_process/', WebChatController.loadMessage);

/************************************************
 * export de rutas
 ************************************************/
module.exports = router;
