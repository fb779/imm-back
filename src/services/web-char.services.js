/************************************************
 *  Importaciones
 ************************************************/
const WebChat = require('../model/web-chat.model');

function findMessageByProcess(id_process) {
  return new Promise(async (resolve, reject) => {
    try {
      const chats = await WebChat.find({process: id_process})
        .sort({updatedAt: 1})
        .select('-__v -createdAt -updatedAt')
        .populate([{path: 'user', select: '-img -active -client -email -password -createdAt -updatedAt -__v '}]);

      return resolve(chats);
    } catch (error) {
      // errorHandler(error, reject);
      return reject({
        status: 500,
        message: `Error, cann't find list chats whit this process`,
        errors: error,
      });
    }
  });
}

function createMessage(newChat) {
  return new Promise(async (resolve, reject) => {
    try {
      const chat = new WebChat(newChat);
      await chat.save();
      return resolve(chat);
    } catch (error) {
      return reject({
        status: 500,
        message: `Error, cann't find list chats whit this process`,
        errors: error,
      });
    }
  });
}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
// const errorHandler = (error, reject) => {

//   if (error.hasOwnProperty('status')) {
//     return reject(error);
//   }
//   return reject({
//     status: 500,
//     message: `Error, cann't find list chats whit this process`,
//     errors: error
//   });
// }

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
  findMessageByProcess,
  createMessage,
};
