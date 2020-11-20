const Step = require('../model/step.model');
const _ = require('underscore');
const {valuesActivateStep} = require('../config/config');

// obtener un listado de steps
function getStepList(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!filter || typeof filter !== 'object') {
        reject({
          status: 400,
          message: 'Error: Internal server error to Step',
          error,
        });
      }

      const data = await Step.find(filter).populate({path: 'visa_categorie', select: 'name'}).sort('visa_categorie order');
      // const data = await Step.find(filter).sort('visa_categorie order');

      resolve(data);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error: Internal server error to Step',
        error,
      });
    }
  });
}

// obtener un step por su Id
function getStepId(id) {
  return new Promise(async (resolve, reject) => {
    try {
      // const data = await Step.findById(id).populate({path: 'visa_categorie', select: 'name'});
      const data = await Step.findById(id);

      if (!data) {
        reject({status: 400, message: `The Step Id: "${id}" does't exist`, error: "This Step does't exist"});
      }

      resolve(data);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error: Internal server error to Step',
        error,
      });
    }
  });
}

// obtener un step por su Id
function createStep(body) {
  return new Promise(async (resolve, reject) => {
    try {
      body = _.pick(body, ['name', 'order', 'visa_categorie', 'active', 'description']);

      const data = await Step.create(body);

      resolve(data);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create Step',
        error,
      });
    }
  });
}

function editStep(id, body) {
  return new Promise(async (resolve, reject) => {
    try {
      body = _.pick(body, ['name', 'order', 'visa_categorie', 'active', 'description']);

      // permite la actualizacion del campo unique
      const data = await Step.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}).populate({
        path: 'visa_categorie',
        select: 'name',
      });

      // (id, body, {new: true, runValidators: true, context: 'query'});
      // const data = await Step.findOneAndUpdate(id, body, {new: true, runValidators: true});

      if (!data) {
        reject({status: 404, message: 'Step not found', error: `This step ${id} does not exist`});
      }

      resolve(data);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error: update Step',
        error,
      });
    }
  });
}

function deleteStep(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Step.findByIdAndDelete(id);

      if (!data) {
        reject({status: 404, message: 'Step not found', error: `This step ${id} doesn't exist`});
      }

      resolve(data);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error: delete Step',
        error,
      });
    }
  });
}

function validStepName(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      const steps = await Step.find(filter);

      const rta = steps.length > 0 ? true : false;

      resolve(rta);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to valid step',
        errors: error,
      });
    }
  });
}

// function editStepToInactive(id) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const data = await Step.findByIdAndUpdate(id, {active: valuesActivateStep.inactive});

//       if (!data) {
//         reject({status: 404, message: 'Step not found', error: `This step ${id} does not exist`});
//       }

//       resolve(data);
//     } catch (error) {
//       reject({
//         status: 400,
//         message: 'Error: delete Step',
//         error,
//       });
//     }
//   });
// }

module.exports = {
  getStepList,
  getStepId,
  createStep,
  editStep,
  deleteStep,
  validStepName,
  // editStepToInactive,
};
