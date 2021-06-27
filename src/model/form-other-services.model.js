const mongoose = require('mongoose');
const BaseForm = require('./form-base.model');
const uniqueValidator = require('mongoose-unique-validator');
const {visaCategories, formOtherServices} = require('../config/config');

const Schema = mongoose.Schema;

const FormOtherServicesSchema = new Schema({
  p_description: {type: String, required: true},
});

// FormOtherServicesSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
// FormOtherServicesSchema.pre('save', async function (next) {
//   const form = this;
//   // const fields = this.schema.obj;
//   if (!this.created) {
//     console.log('base form other services');
//   }
//   return next();
// });

// FormOtherServicesSchema.pre('findOneAndUpdate', async function (next) {
//   const form = this.getUpdate();
//   const fields = this.schema.obj;
//   return next();
// });

module.exports = BaseForm.discriminator(formOtherServices, FormOtherServicesSchema);

// module.exports = {
//   eta: BaseForm.discriminator(visaCategories.eta, FormOtherServicesSchema),
//   gcms_notes: BaseForm.discriminator(visaCategories.gcms_notes, FormOtherServicesSchema),
//   status_verification: BaseForm.discriminator(visaCategories.status_verification, FormOtherServicesSchema),
//   document_replacement: BaseForm.discriminator(visaCategories.document_replacement, FormOtherServicesSchema),
//   document_replacement_citizenship: BaseForm.discriminator(visaCategories.document_replacement_citizenship, FormOtherServicesSchema),
//   amendment_documents: BaseForm.discriminator(visaCategories.amendment_documents, FormOtherServicesSchema),
//   temporary_resident_extension: BaseForm.discriminator(visaCategories.temporary_resident_extension, FormOtherServicesSchema),
//   pgwp: BaseForm.discriminator(visaCategories.pgwp, FormOtherServicesSchema),
// };
