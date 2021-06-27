const _ = require('underscore');
const {visaCategories} = require('../config/config');

const FormBase = require('../model/form-base.model');
const FormVisitorModel = require('../model/form-visitor.model');
const FormStudyPermitModel = require('../model/form-study-permit.model');
const FormWorkPermitModel = require('../model/form-work-permit.model');
const FormPrStreamModel = require('../model/form-prstream.model');
const FormExpressEntryModel = require('../model/form-express-entry.model');
const FormCitizenshipModel = require('../model/form-citizenship.model');
const FormOtherServices = require('../model/form-other-services.model');

function defineForm(type) {
  let form = null;

  switch (type) {
    case visaCategories.visitor:
      form = FormVisitorModel;
      break;

    case visaCategories.studypermit:
      form = FormStudyPermitModel;
      break;

    case visaCategories.workpermit:
      form = FormWorkPermitModel;
      break;

    case visaCategories.prstream:
      form = FormPrStreamModel;
      break;

    case visaCategories.expressentry:
      form = FormExpressEntryModel;
      break;

    case visaCategories.citizenship:
      form = FormCitizenshipModel;
      break;

    case visaCategories.eta:
    case visaCategories.gcms_notes:
    case visaCategories.status_verification:
    case visaCategories.document_replacement:
    case visaCategories.document_replacement_citizenship:
    case visaCategories.amendment_documents:
    case visaCategories.temporary_resident_extension:
    case visaCategories.pgwp:
      form = FormOtherServices;
      break;
  }

  return form;
}

function createForm(process, dataForm) {
  return new Promise(async (resolve, reject) => {
    try {
      delete dataForm._id;

      let {
        visa_category: {title: kindVisa},
      } = process;

      kindVisa = FormBase.getTypeOfForm(kindVisa);

      const newData = {...dataForm, kind: kindVisa, client: process.client, process: process};

      form = await FormBase.create(newData);

      return resolve(form);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to create form',
        errors: error,
      });
    }
  });
}

function editForm(form_id, process, newFormData) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        visa_category: {title: kindVisa},
      } = process;

      const FormVisa = defineForm(kindVisa);

      kindVisa = FormBase.getTypeOfForm(kindVisa);

      newFormData = {...newFormData, kind: kindVisa};

      // const form = await FormVisa.findOneAndUpdate({process}, {$set: {...newFormData}}, {new: true, runValidators: true, context: 'query'});
      const form = await FormVisa.findOneAndUpdate({process}, newFormData, {new: true, runValidators: true});

      return resolve(form);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to edit form',
        errors: error,
      });
    }
  });
}

function getFormByProcess(process) {
  return new Promise(async (resolve, reject) => {
    try {
      const form = await FormBase.findOne({process}).populate([{path: 'client', select: '-active -createdAt -updatedAt -__v'}]);

      return resolve(form);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to create form',
        errors: error,
      });
    }
  });
}

module.exports = {
  createForm,
  editForm,
  getFormByProcess,
};
