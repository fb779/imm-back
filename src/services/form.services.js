const _ = require('underscore');
const {visaCategories} = require('../config/config');

const FormBase = require('../model/form-base.model');
const FormVisitorModel = require('../model/form-visitor.model');
const FormExpressEntryModel = require('../model/form-express-entry.model');
const FormWorkPermitModel = require('../model/form-work-permit.model');

function defineForm(type) {
  let form = null;

  switch (type) {
    case visaCategories.visitor:
      form = FormVisitorModel;
      break;

    case visaCategories.expressentry:
      form = FormExpressEntryModel;
      break;

    case visaCategories.workpermit:
      form = FormWorkPermitModel;
      break;
  }

  return form;
}

function createForm(process, dataForm) {
  return new Promise(async (resolve, reject) => {
    try {
      delete dataForm._id;

      const {
        visa_category: {title: kindVisa},
      } = process;

      const newData = {...dataForm, kind: kindVisa, client: process.client, process: process._id};

      var form = await FormBase.findOne({process: process});
      if (!form) {
        // newForm = new FormVisa(form);
        // await newForm.save();
        form = await FormBase.create(newData);
      } else {
        form = await FormBase.findOneAndUpdate({process: process}, form, {new: true, runValidators: true});
      }

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

function editForm(form_id, process, oldForm) {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        visa_category: {title: kindVisa},
      } = process;

      const FormVisa = defineForm(kindVisa);

      // const form = await FormVisa.findOneAndUpdate({process}, {$set: {...oldForm}}, {new: true, runValidators: true, context: 'query'});
      const form = await FormVisa.findOneAndUpdate({process}, oldForm, {new: true, runValidators: true});

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
      // const form = await FormVisitor.findOne({process: process}).populate([{path: 'client', select: '-active -createdAt -updatedAt -__v'}]);
      const form = await FormBase.findOne({process: process}).populate([{path: 'client', select: '-active -createdAt -updatedAt -__v'}]);

      // if (!form) {
      //   return reject({
      //     status: 403,
      //     message: `Error, Form doesn't exist`,
      //     errors: error,
      //   });
      // }

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
