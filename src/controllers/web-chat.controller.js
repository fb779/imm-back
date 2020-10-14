/************************************************
 *  Importaciones
 ************************************************/
const WebChatService = require('../services/web-char.services');
const ProcessService = require('../services/process.services');
const UserService = require('../services/user.services');

/************************************************
 *  metodos de controlador
 ************************************************/

async function loadMessage(req, res, next) {
  try {
    const id_process = req.params.id_process;

    const process = await ProcessService.getProcessId(id_process);

    const chats = await WebChatService.findMessageByProcess(process._id);
    res.status(200).json({
      ok: true,
      data: chats,
      // message: `cargando los mensajes del proceso`,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createMessage(req, res, next) {
  try {
    const body = req.body;

    const process = await ProcessService.getProcessId(body.process);

    const user = await UserService.getUserById(body.user);

    const newChat = await WebChatService.createMessage(body);

    res.status(200).json({
      ok: true,
      data: newChat,
      // message: `creando los mensajes del proceso`,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
      error: error.errors,
    });
  }
  return res.status(500).json({
    ok: false,
    message: 'error en el servicio de creacion del listado de documentos',
    error,
  });
};

/************************************************
 *  exports
 ************************************************/

module.exports = {
  loadMessage,
  createMessage,
};
