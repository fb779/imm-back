const mongoose = require('mongoose');
const BaseForm = require('./form-base.model');
const uniqueValidator = require('mongoose-unique-validator');
const {visaCategories} = require('../config/config');
const {EducationSchema, WorkDetailSchema} = require('./form-public-schema.model');

const Schema = mongoose.Schema;

const FormPrStreamSchema = new Schema({
  // marital status
  p_marital_001: {type: String, default: null, required: true},
  p_marital_002: {type: String, default: null},
  p_marital_003: {type: String, default: null},

  // information
  p_information_001: {type: String, default: null, required: true},
  p_information_002: {type: String, default: null, required: true},

  // visit
  p_visit_001: {type: String, default: null, required: true},
  p_visit_002: {type: String, default: null, required: true},
  p_visit_003: {type: String, default: null, required: true},
  p_visit_004: {type: String, default: null, required: true},
  p_visit_005: {type: String, default: null, required: true},

  // education
  p_education_001: {type: String, default: null, required: true},
  p_education_list: [EducationSchema],
  p_education_spouse_001: {type: String, default: null},
  p_education_spouse_list: [EducationSchema],

  // language
  p_language_001: {type: String, default: null, required: true},
  // espefic details for englis test (IELST, CELPIP)
  p_language_en_001: {type: String, default: null},
  p_language_en_002: {type: String, default: null},
  p_language_en_003: {type: String, default: null},
  p_language_en_004: {type: String, default: null},
  p_language_en_005: {type: String, default: null},
  p_language_en_006: {type: String, default: null},
  p_language_en_007: {type: String, default: null},

  // language french
  // espefic details for englis test (TCF, TEF)
  p_language_fr_001: {type: String, default: null},
  p_language_fr_002: {type: String, default: null},
  p_language_fr_003: {type: String, default: null},
  p_language_fr_004: {type: String, default: null},
  p_language_fr_005: {type: String, default: null},
  p_language_fr_006: {type: String, default: null},

  // language englis
  p_language_spouse_001: {type: String, default: null},
  p_language_spouse_en_001: {type: String, default: null},
  p_language_spouse_en_002: {type: String, default: null},
  p_language_spouse_en_003: {type: String, default: null},
  p_language_spouse_en_004: {type: String, default: null},
  p_language_spouse_en_005: {type: String, default: null},
  p_language_spouse_en_006: {type: String, default: null},
  p_language_spouse_en_007: {type: String, default: null},

  // language french
  p_language_spouse_fr_001: {type: String, default: null},
  p_language_spouse_fr_002: {type: String, default: null},
  p_language_spouse_fr_003: {type: String, default: null},
  p_language_spouse_fr_004: {type: String, default: null},
  p_language_spouse_fr_005: {type: String, default: null},
  p_language_spouse_fr_006: {type: String, default: null},

  // work details
  p_workdetail_001: {type: String, default: null, required: true},
  p_workdetail_002: {type: String, default: null, required: true},
  p_workdetail_003: {type: String, default: null, required: true},
  p_workdetail_004: {type: String, default: null},
  p_workdetail_list: [WorkDetailSchema],
  p_workdetail_spouse_list: [WorkDetailSchema],

  // family
  p_family_001: {type: String, default: null, required: true},
  p_family_002: {type: String, default: null},
  p_family_003: {type: String, default: null},
  p_family_004: {type: String, default: null},

  // financial
  p_financial_001: {type: String, default: null, required: true},
});

// FormPrStreamSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
FormPrStreamSchema.pre('save', async function (next) {
  const form = this;
  const fields = this.schema.obj;

  if (form.p_marital_001 != 2) {
    Object.keys(fields)
      .filter((el) => el.includes('spouse'))
      .map((el) => {
        form[el] = el.includes('list') ? [] : null;
      });
  }

  return next();
});

FormPrStreamSchema.pre('findOneAndUpdate', async function (next) {
  const form = this.getUpdate();
  const fields = this.schema.obj;

  if (form.p_marital_001 != 2) {
    Object.keys(fields)
      .filter((el) => el.includes('spouse'))
      .map((el) => {
        form[el] = el.includes('list') ? [] : null;
      });
  }

  return next();
});

module.exports = BaseForm.discriminator(visaCategories.prstream, FormPrStreamSchema);
