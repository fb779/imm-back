const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {activateStep, valuesActivateStep} = require('../config/config');
const VisaCategorieModel = require('./visa-category.model');

const Schema = mongoose.Schema;

const StepSchema = new Schema(
  {
    name: {type: String, required: [true, 'The {PATH} is required'], lowercase: true, trim: true},
    description: {type: String, default: '', trim: true},
    visa_categorie: {type: Schema.Types.ObjectId, ref: 'VisaCategory', required: [true, 'The {PATH} is required']},
    order: {type: Number, required: [true, 'The field {PATH} is required'], min: [1, 'The min value is {MIN}'], max: [99, 'The max value is {MAX}']},
    active: {type: String, default: valuesActivateStep.active, enum: activateStep, uppercase: true},
  },
  {timestamps: true, collection: 'steps'}
);

StepSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

StepSchema.path('visa_categorie').validate(async function (value) {
  const val = await VisaCategorieModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

/**
 * method of remove password to response
 */
StepSchema.methods.toJSON = function () {
  const stepObject = this.toObject();

  delete stepObject.createdAt;
  delete stepObject.updatedAt;
  delete stepObject.__v;
  return stepObject;
};

module.exports = mongoose.model('Step', StepSchema);
// StepModel = mongoose.model('Step', StepSchema);
// module.exports = StepModel;
