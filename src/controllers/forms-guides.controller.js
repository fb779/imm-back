/************************************************
 *  Importaciones
 ************************************************/
const fs = require('fs');

const ProcessService = require('../services/process.services');
const ClientService = require('../services/client.services');
const DocumentServices = require('../services/document.services');
const FormsGuidesService = require('../services/forms-guides.services');

/************************************************
 *  Deficnicion de metodos
 ************************************************/
async function getFormGuideById(req, res, netx) {
  try {
    const id_form_guide = req.params.id_form_guide;

    const form_guide = await FormsGuidesService.getformGuideById(id_form_guide);

    res.status(200).json({
      ok: true,
      data: form_guide,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getFormsGuidesByProcess(req, res, next) {
  try {
    const type = req.params.type;
    const id_process = req.params.id_process;

    const list = await FormsGuidesService.getformsGuidesByProcess(id_process, type);

    res.status(200).json({
      ok: true,
      list,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getFormsGuidesByClient(req, res, net) {
  try {
    const user = req.user;
    const id_client = req.params.id_client;
    const type = req.query.type || null;

    const client = await ClientService.getById(id_client);
    const processes = await ProcessService.getProcessesByClient(client._id);

    const list_processes = processes.map((el) => el._id.toString());

    const formsGuides = await FormsGuidesService.getformsGuidesByProcesses(list_processes, type);

    return res.status(200).json({
      ok: true,
      list: formsGuides,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
async function deleteFormGuideById(req, res, next) {
  try {
    const id_form_guide = req.params.id_form_guide;

    const formguide = await FormsGuidesService.deleteFormGuide(id_form_guide);

    if (fs.existsSync(formguide.directory)) {
      fs.unlink(formguide.directory, (err) => {
        if (err) {
          throw {
            message: `the file couldn't delete`,
          };
        }
      });
    }

    res.status(200).json({
      ok: true,
      formguide,
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
    message: 'error en el servicio de formularios y guias',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
  getFormGuideById,
  getFormsGuidesByProcess,
  getFormsGuidesByClient,
  deleteFormGuideById,
};
