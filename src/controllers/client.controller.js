/************************************************
 *  Importaciones
 ************************************************/
const Client = require('../model/client.model');
const ClientService = require('../services/client.services');
const moment = require('moment');

// metodo cargar todos los procesos del usuario
async function getClientes(req, res, next) {
  Client.find().exec((err, listClients) => {
    if (err) {
      errorHandler(err, res);
    }

    return res.status(200).json({
      data: {
        ok: true,
        list: listClients,
      },
    });
  });
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
  createCliente,
  editCliente,
  deleteCliente,
};
