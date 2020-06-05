/************************************************
 *  Definicion
 ************************************************/
const express = require('express');

/************************************************
 *  Imports
 ************************************************/
const auth = require('./../../middlewares/auth.guard');
const WebChatController = require('../../controllers/web-chat.controller');

/************************************************
 * Inicialización
 ************************************************/

const router = express.Router();


/************************************************
 * Definicion de rutas
 ************************************************/

// router.use([auth.isAuth, hasRole])
router.post('/', [], WebChatController.createMessage);
router.get('/:id_process/', [], WebChatController.loadMessage);


function hasRole(req, res, next) {
  let user = req.user;

  res.status(200).json({
    message: `middleware has role `,
    user
  })
}

/************************************************
 * export de rutas
 ************************************************/
module.exports = router;