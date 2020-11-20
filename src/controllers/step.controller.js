/************************************************
 *  Importaciones
 ************************************************/
const StepService = require('../services/step.services');
// const VisaCategoryService = require('../services/visa-category.services');
const {roles, valuesActivateStep} = require('../config/config');

async function getStepList(req, res, next) {
  try {
    const user = req.user;

    const filter = {};

    if (user.role !== roles.admin) {
      filter['active'] = valuesActivateStep.active;
    }

    const list = await StepService.getStepList(filter);

    res.status(200).json({
      ok: true,
      data: list,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getStepId(req, res, next) {
  try {
    const id = req.params.id;

    const data = await StepService.getStepId(id);

    // if (!data) {
    //   throw {
    //     status: 404,
    //     ok: true,
    //     messages: "Step doesn't exist",
    //   };
    // }

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createStep(req, res, next) {
  try {
    const body = req.body;

    const data = await StepService.createStep(body);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editStep(req, res, next) {
  try {
    const id = req.params.id;
    const body = req.body;

    const data = await StepService.editStep(id, body);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteStep(req, res, next) {
  try {
    const id = req.params.id;

    const data = await StepService.deleteStep(id);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function validStepName(req, res, next) {
  try {
    const name = req.query.name || null;

    if (!name) {
      throw {
        status: 400,
        ok: false,
        message: 'Error in the information',
      };
    }

    const filter = {name};

    const data = await StepService.validStepName(filter);

    return res.status(200).json({
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
  const {status, message, error: er} = error;
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      message,
      error: er,
    });
  }

  return res.status(500).json({
    ok: false,
    message: 'error internal step services ',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
  getStepList,
  getStepId,
  createStep,
  editStep,
  deleteStep,
  validStepName,
};
