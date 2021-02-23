/************************************************
 *  Importaciones
 ************************************************/
const Client = require('../model/client.model');
const ClientService = require('../services/client.services');
const {roles} = require('../config/config');
const moment = require('moment');

// metodo cargar todos los procesos del usuario
async function getClientes(req, res, next) {
  try {
    const list = await ClientService.getClientList();

    res.status(200).json({
      ok: true,
      data: list,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// metodo cargar todos los procesos del usuario
async function getClientListByUser(req, res, next) {
  try {
    const {id: userId} = req.params;

    const list = await ClientService.getClientListByUser(userId);

    res.status(200).json({
      ok: true,
      data: list,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getClienteId(req, res, next) {
  try {
    const id = req.params.id;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        data: {
          ok: true,
          messages: "Client doesn't exist",
        },
      });
    }

    return res.status(200).json({
      data: {
        ok: true,
        client,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createCliente(req, res, next) {
  try {
    var body = req.body;
    const client = await ClientService.createClient(body);

    return res.status(200).json({
      data: {
        ok: true,
        client,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editCliente(req, res, next) {
  try {
    const id = req.params.id;
    var body = req.body;

    const client = await ClientService.editClient(id, body);

    return res.status(200).json({
      data: {
        ok: true,
        messages: 'edit client to id',
        client,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteCliente(req, res, next) {
  try {
    const id = req.params.id;

    const client = await ClientService.deleteClient(id);

    return res.status(200).json({
      data: {
        ok: true,
        messages: 'deleted client to id',
        client,
      },
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
    message: 'Error services client',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/
module.exports = {
  getClientes,
  getClienteId,
  getClientListByUser,
  createCliente,
  editCliente,
  deleteCliente,
};
