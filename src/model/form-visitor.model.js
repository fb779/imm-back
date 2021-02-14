const mongoose = require('mongoose');
const BaseForm = require('./form-base.model');
const uniqueValidator = require('mongoose-unique-validator');
const {visaCategories, kindVisaCategories} = require('../config/config');

const Schema = mongoose.Schema;

const FormVisitorSchema = new Schema({
  p_information_001: {type: String, required: true},
  p_information_002: {type: String, required: true},
  p_information_003: {type: String, required: true},
  p_information_004: {type: String, required: true},
  p_information_005: {type: String, required: true},

  p_familyinfo_001: {type: String, required: true},
  p_familyinfo_002: {type: String, required: true},
  p_familyinfo_003: {type: String, required: true},
  p_familyinfo_004: {type: String, required: true},
  p_familyinfo_005: {type: String, required: false},
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
