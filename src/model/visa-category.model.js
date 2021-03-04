const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {kindVisaCategories} = require('../config/config');

const Schema = mongoose.Schema;

const VisaCategorySchema = new Schema(
  {
    name: {type: String, required: [true, 'the {PATH} is required'], unique: true, uppercase: true},
    title: {type: String, enum: kindVisaCategories, required: [true, 'the {PATH} is required'], unique: true},
    product: {type: String, default: null, lowercase: true},
    description: {type: String, required: false},
    active: {type: Boolean, default: true},
  },
  {timestamps: true, collection: 'visacategory', id: false, toJSON: {virtuals: true}}
);

VisaCategorySchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

VisaCategorySchema.static('findByTitle', function (title) {
  return this.findOne({title});
});

VisaCategorySchema.static('findByProduct', function (product) {
  return this.findOne({product: product.toLowerCase()});
});

module.exports = mongoose.model('VisaCategory', VisaCategorySchema);
