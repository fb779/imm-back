const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {kindVisaCategories} = require('../config/config');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - name: string
 * - description: string
 * - active: boolean
 */

const VisaCategorySchema = new Schema(
  {
    name: {type: String, required: [true, 'the {PATH} is required'], unique: true, uppercase: true},
    title: {type: String, enum: kindVisaCategories, required: [true, 'the {PATH} is required'], unique: true},
    description: {type: String, required: false},
    active: {type: Boolean, default: true},
  },
  {timestamps: true, collection: 'visacategory', id: false, toJSON: {virtuals: true}}
);

VisaCategorySchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

// VisaCategorySchema.virtual('title').get(function () {
//   const {name} = this;
//   return name.toLowerCase().replace(/\s/, '-');
// });

VisaCategorySchema.static('findByTitle', function (title) {
  return this.findOne({title});
});

module.exports = mongoose.model('VisaCategory', VisaCategorySchema);
