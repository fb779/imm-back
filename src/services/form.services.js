const FormVisitor = require('../model/form-visitor.model');

const ClientServices = require('../services/client.services');


function createForm(process, form) {
  return new Promise(async(resolve, reject) => {
    try {

      delete form._id;
      form.client = process.client;
      form.process = process._id;

      var newForm = await FormVisitor.findOne({ process: process });

      if (!newForm) {
        newForm = new FormVisitor(form);
      }

      await newForm.save();

      return resolve(newForm);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to create form',
        errors: error
      });
    }
  });
}

function editForm(process, oldForm) {
  return new Promise(async(resolve, reject) => {
    try {
      const form = await FormVisitor.findOne({ _id: oldForm._id, process: process });

      if (!form) {
        return reject({
          status: 404,
          message: 'Error to update form',
          errors: []
        });
      }

      if (oldForm.destiny) { form.destiny = oldForm.destiny; }
      if (oldForm.marital_status) { form.marital_status = oldForm.marital_status; }

      form.number_accompanying = oldForm.number_accompanying;
      if (oldForm.purpose_visit) { form.purpose_visit = oldForm.purpose_visit; }
      if (oldForm.letter_invitation) { form.letter_invitation = oldForm.letter_invitation; }
      if (oldForm.stay_canada) { form.stay_canada = oldForm.stay_canada; }
      if (oldForm.funds) { form.funds = oldForm.funds; }
      if (oldForm.disease) { form.disease = oldForm.disease; }
      if (oldForm.criminal_act) { form.criminal_act = oldForm.criminal_act; }
      if (oldForm.refuse_canada) { form.refuse_canada = oldForm.refuse_canada; }

      form.comments = oldForm.comments;

      await form.save();

      return resolve(form);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to edit form',
        errors: error
      });
    }
  });
}

function getFormByProcess(process) {
  return new Promise(async(resolve, reject) => {
    try {

      const form = await FormVisitor.findOne({ process: process }).populate([{ path: 'client', select: '-active -createdAt -updatedAt -__v' }]);

      if (!form) {
        return reject({
          status: 403,
          message: `Error, Form doesn't exist`,
          errors: error
        });
      }

      return resolve(form);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to create form',
        errors: error
      });
    }
  });
}




module.exports = {
  createForm,
  editForm,
  getFormByProcess,
}