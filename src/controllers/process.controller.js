/************************************************
 *  Importaciones
 ************************************************/
const Process = require('../model/proceso.model');
const ProcessServices = require('../services/process.services');
const FormServices = require('../services/form.services');
const ClientServices = require('../services/client.services');
const VisaCategoryServices = require('../services/visa-category.services');
const {valuesStatusStep, roles} = require('../config/config');
const campos = '_id first_name last_name email role active';

async function getProcess(req, res, next) {
  try {
    const user = req.user || null;

    var ListProcess = [];

    switch (user.role) {
      case roles.admin:
        {
          ListProcess = await ProcessServices.getProcesses({status: {$in: ['FORM']}}, [{path: 'client'}, {path: 'visa_category'}]);
        }
        break;
      case roles.user:
        {
          ListProcess = await ProcessServices.getProcesses({consultant: user._id, status: 'ASIGNED'}, [{path: 'client'}, {path: 'visa_category'}]);
        }
        break;
      case roles.client:
        {
          ListProcess = await ProcessServices.getProcesses({client: user.client}, [{path: 'client'}, {path: 'visa_category'}, {path: 'consultant'}]);
        }
        break;
    }

    res.status(200).json({
      ok: true,
      list: ListProcess,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getProcessId(req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;

    const process = await Process.findOne({_id: id}).populate([
      {path: 'client', select: '-active -createdAt -updatedAt -__v'},
      {path: 'visa_category', select: '-createdAt -updatedAt -__v'},
    ]);

    if (!process) {
      return res.status(404).json({
        data: {
          ok: true,
          message: "Process doesn't exist",
        },
      });
    }

    res.status(200).json({
      ok: true,
      process,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createProcess(req, res, next) {
  try {
    const body = req.body;

    // consultar el cliente
    const client = await ClientServices.getByEmail(body.client);

    // consultar el tipo de visado
    const visa = await VisaCategoryServices.getByName(body.visa_category);

    body.client = client;
    body.visa_category = visa;

    const process = await ProcessServices.createProcess(body);

    res.status(200).json({
      ok: true,
      body,
      process,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editProcess(req, res, next) {
  try {
    const id_process = req.params.id;
    const user = req.user;
    const body = req.body;
    const id_form = body._id;

    // consultar el proceso
    const process = await Process.findById(id_process);

    if (!process) {
      return res.status(404).json({
        data: {
          ok: false,
          message: "Process doesn't exist",
        },
      });
    }

    if (body.client && process.client != body.client) {
      process.client = body.client;
    }

    if (body.consultant && process.consultant != body.consultant) {
      process.consultant = body.consultant;
    }

    if (body.status && process.status != body.status) {
      process.status = body.status;
    }

    // guardado del proceso con el consultor
    await process.save();

    return res.status(200).json({
      ok: true,
      process,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// async function deleteProcess(req, res, next) {
//     try {
//         const id = req.params.id;
//         // const checkList = await CheckListService.deleteCheckList(id);
//         // const checkList = await CheckListService.disableCheckList(id);
//         // const checkList = await CheckListService.enableCheckList(id);
//         res.status(200).json({
//             ok: true,
//             // check: checkList
//         });
//     } catch (error) {
//         errorHandler(error, res);
//         // res.status(error.status).json({
//         //     ok: false,
//         //     message: error.message,
//         //     errors: error.errors
//         // });
//     }
// }

async function getProcessIdClient(req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;

    const process = await Process.findOne({_id: id, client: user.client}, {client: 1}).populate([{path: 'client', select: '-active -createdAt -updatedAt -__v'}]);

    if (!process) {
      return res.status(404).json({
        data: {
          ok: true,
          message: "Process doesn't exist",
        },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Load client to process',
      process,
      client: process.client,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createFormProcess(req, res, next) {
  try {
    const id_process = req.params.id;
    const body = req.body;

    const process = await Process.findOne({_id: id_process}).populate([{path: 'client'}, {path: 'visa_category'}]);

    await ClientServices.editClient(process.client._id, body);

    const form = await FormServices.createForm(process, body);

    process.status = 'FORM';

    await process.save();

    res.status(200).json({
      ok: true,
      form,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getProcessIdForm(req, res, next) {
  try {
    const id = req.params.id;

    const process = await Process.findOne({_id: id}).populate([{path: 'client'}, {path: 'visa_category'}]);

    if (!process) {
      return res.status(404).json({
        data: {
          ok: false,
          message: "Process references doesn't exist",
        },
      });
    }

    const form = await FormServices.getFormByProcess(process);

    if (!form) {
      return res.status(404).json({
        data: {
          ok: false,
          message: "Form doesn't exist",
        },
      });
    }

    return res.status(200).json({
      ok: true,
      form,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editProcessIdForm(req, res, next) {
  try {
    const id_process = req.params.id;
    const id_form = req.body._id;
    const body = req.body;

    const process = await Process.findById(id_process).populate([{path: 'client'}]);

    await ClientServices.editClient(process.client._id, body);

    const form = await FormServices.editForm(process, body);

    return res.status(200).json({
      data: {
        ok: true,
        // process,
        // form,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editStepProcess(req, res, next) {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const data = await ProcessServices.setStatusStep(id, status);

    res.status(200).json({
      ok: true,
      data,
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
 *  Export de metodos
 ************************************************/

module.exports = {
  getProcess,
  getProcessId,
  createProcess,
  editProcess,
  // deleteProcess,
  getProcessIdClient,
  createFormProcess,
  editProcessIdForm,
  getProcessIdForm,
  editStepProcess,
};
