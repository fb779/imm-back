const mongoose = require('mongoose');
const {statusVisa, statusStep, valuesStatusStep} = require('./../config/config');
const uniqueValidator = require('mongoose-unique-validator');
const UserModel = require('./user.model');
const ClientModel = require('./client.model');
const VisaCategorieModel = require('./visa-category.model');
const StepModel = require('./step.model');

const Schema = mongoose.Schema;

// const StepProcessSchema = new Schema({
//   name: {type: String, required: true},
//   status: {type: String, default: valuesStatusStep.inprogres, enum: statusStep, uppercase: true},
// });

const ProcessSchema = new Schema(
  {
    client: {type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The user is required']},
    consultant: {type: Schema.Types.ObjectId, ref: 'User', required: [false, 'The consultan is required']},
    visa_category: {type: Schema.Types.ObjectId, ref: 'VisaCategory', required: [true, 'The type visa is required']},
    code: {type: String, uppercase: true, unique: true},
    status: {type: String, default: 'ACTIVE', enum: statusVisa, uppercase: true},
    active: {type: Boolean, default: true},
    companion: {type: Number, default: 1},
    // steps: [StepProcessSchema],
    steps: [
      {
        name: {type: String, required: true},
        status: {type: String, default: valuesStatusStep.inprogres, enum: statusStep, uppercase: true},
      },
    ],
    createdAt: {
      type: Date,
      immutable: true, // Make `createdAt` immutable
    },
  },
  {timestamps: true, collection: 'process', toObject: {virtuals: true}}
);

ProcessSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to create a unique code
 */
ProcessSchema.pre('save', async function (next) {
  const process = this;

  if (this.isNew) {
    const list_process = await Process.find({visa_category: process.visa_category}).sort({code: -1});
    const nextValueCode = list_process.length > 0 && list_process[0] ? Number(list_process[0].code.slice(-1)) : 0;
    const nextCode = `${process.visa_category.name}-${String(nextValueCode + 1).padStart(10, '0')}`;

    process.code = nextCode;

    const steps = (await StepModel.find({visa_categorie: process.visa_category})).map(({name}) => ({name}));
    if (steps.length > 1) process.steps = steps;
  }
  return next();
});

/**
 * method to validate if visa_categorie ref exist in the your collection
 */
ProcessSchema.path('client').validate(async function (value) {
  const val = await ClientModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

/**
 * method to validate if visa_categorie ref exist in the your collection
 */
ProcessSchema.path('consultant').validate(async function (value) {
  const val = await UserModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

/**
 * method to validate if visa_categorie ref exist in the your collection
 */
ProcessSchema.path('visa_category').validate(async function (value) {
  const val = await VisaCategorieModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

const Process = mongoose.model('Process', ProcessSchema);

module.exports = Process;
