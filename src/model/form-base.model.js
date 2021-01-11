const mongoose = require('mongoose');
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
    process: {type: Schema.Types.ObjectId, ref: 'Process', unique: true, required: [true, 'The process is required']},
    client: {type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The user is required']},
  },
  baseOptions
);

BaseSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
// BaseSchema.pre('save', async function (next) {
//   const form = this;

//   return next();
// });

/**
 * method to validate if visa_categorie ref exist in the your collection
 */
BaseSchema.path('client').validate(async function (value) {
  const val = await ClientModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

BaseSchema.path('process').validate(async function (value) {
  const val = await ProcessModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

module.exports = mongoose.model('BaseForm', BaseSchema);
