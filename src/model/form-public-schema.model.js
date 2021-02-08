const Schema = require('mongoose').Schema;

const EducationSchema = new Schema({
  level: {type: String, required: true},
  study: {type: String, required: true},
  institution: {type: String, required: true},
  duration: {type: String, required: true},
  country: {type: String, required: true},
});

const WorkDetailSchema = new Schema({
  title: {type: String},
  duties: {type: String},
  company: {type: String},
  duration: {type: String},
  hoursPerWeek: {type: String},
  country: {type: String},
});

module.exports = {
  EducationSchema,
  WorkDetailSchema,
};
