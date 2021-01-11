const mongoose = require('mongoose');
const BaseForm = require('./form-base.model');
const uniqueValidator = require('mongoose-unique-validator');
const {visaCategories, kindVisaCategories} = require('../config/config');

const Schema = mongoose.Schema;

const FormExpressEntrySchema = new Schema({
  destiny: {type: String, required: true},
});

// FormExpressEntrySchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
FormExpressEntrySchema.pre('save', async function (next) {
  const form = this;

  return next();
});

module.exports = BaseForm.discriminator(visaCategories.expressentry, FormExpressEntrySchema);
