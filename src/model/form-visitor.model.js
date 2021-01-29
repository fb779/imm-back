const mongoose = require('mongoose');
const BaseForm = require('./form-base.model');
const uniqueValidator = require('mongoose-unique-validator');
const {visaCategories, kindVisaCategories} = require('../config/config');

const Schema = mongoose.Schema;

const FormVisitorSchema = new Schema({
  destiny: {type: String, required: true},
  marital_status: {type: String, required: true},
  purpose_visit: {type: String, required: true},
  letter_invitation: {type: String, required: true},
  stay_canada: {type: String, required: true},
  funds: {type: String, required: true},
  disease: {type: String, required: true},
  criminal_act: {type: String, required: true},
  refuse_canada: {type: String, required: true},
  comments: {type: String, required: false},
});

FormVisitorSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
// FormVisitorSchema.pre('save', async function(next) {
//     const form = this;

//     if (form.isModified('number_accompanying') || !form.number_accompanying) {
//         form.number_accompanying = 0;
//     }

//     return next();
// });

module.exports = BaseForm.discriminator(visaCategories.visitor, FormVisitorSchema);
