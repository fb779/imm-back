const mongoose = require('mongoose');
const {visaCategories, formOtherServices} = require('./../config/config');

const uniqueValidator = require('mongoose-unique-validator');
const ClientModel = require('./client.model');
const ProcessModel = require('./proceso.model');

const Schema = mongoose.Schema;

/**
 * Definicion del modelo base para al guardado de los diferentes formularios
 */
const baseOptions = {
  discriminatorKey: 'kind',
  collection: 'form',
  timestamps: true,
};

BaseSchema = new Schema(
  {
    process: {type: Schema.Types.ObjectId, ref: 'Process', required: [true, 'The process is required'], unique: true},
    client: {type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The client is required']},
  },
  baseOptions
);

BaseSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
// BaseSchema.pre('save', function (next) {
//   const form = this;

//   if (!this.created) {
//     console.log('base form');
//   }

//   return next();
// });

/**
 * method to validate if visa_categorie ref exist in the your collection
 */
// BaseSchema.path('client').validate(async function (value) {
//   const val = await ClientModel.findById(value);
//   return !val ? false : true;
// }, `{PATH} is invalid`);

BaseSchema.path('process').validate(async function (value) {
  const val = await ProcessModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

BaseSchema.static('getTypeOfForm', function (type) {
  // console.log('Hola desde la obtencion del type', type);
  let form = '';
  switch (type) {
    case visaCategories.visitor:
      form = visaCategories.visitor;
      break;

    case visaCategories.studypermit:
      form = visaCategories.studypermit;
      break;

    case visaCategories.workpermit:
      form = visaCategories.workpermit;
      break;

    case visaCategories.prstream:
      form = visaCategories.prstream;
      break;

    case visaCategories.expressentry:
      form = visaCategories.expressentry;
      break;

    case visaCategories.citizenship:
      form = visaCategories.citizenship;
      break;

    /**
     * TODO: Especial cases.
     *    all of cases use the same form (formOtherServices),
     *    if the case will change, it case need to separete the case in swith statement,
     *    and assing the correct value for the new form
     **/
    case visaCategories.eta:
    case visaCategories.gcms_notes:
    case visaCategories.status_verification:
    case visaCategories.document_replacement:
    case visaCategories.document_replacement_citizenship:
    case visaCategories.amendment_documents:
    case visaCategories.temporary_resident_extension:
    case visaCategories.pgwp:
      form = formOtherServices;
      break;
  }

  return form;
});

module.exports = mongoose.model('BaseForm', BaseSchema);
