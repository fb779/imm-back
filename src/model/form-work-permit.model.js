const mongoose = require('mongoose');
const BaseForm = require('./form-base.model');
const uniqueValidator = require('mongoose-unique-validator');
const {visaCategories, kindVisaCategories} = require('../config/config');

const Schema = mongoose.Schema;

const FormWorkPermitSchema = new Schema({
  other: {type: String, required: true},
  more: {type: String, required: true},
});

// FormWorkPermitSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
// FormWorkPermitSchema.pre('save', async function(next) {
//     const form = this;
//     if (form.isModified('number_accompanying') || !form.number_accompanying) {
//         form.number_accompanying = 0;
//     }
//     return next();
// });

module.exports = BaseForm.discriminator(visaCategories.workpermit, FormWorkPermitSchema);
