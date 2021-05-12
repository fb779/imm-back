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

// VisaCategorySchema.pre('save', function (next) {
//   const visa = this;

//   // if (visa.isNew && !visa.product) {
//   //   visa.account_expiration = moment().add(2, 'months').hour(23).minute(59).second(59).toDate();
//   // }

//   return next;
// });

VisaCategorySchema.static('findByTitle', function (title) {
  return this.findOne({title});
});

VisaCategorySchema.static('findByProduct', function (_product) {
  return this.findOne({product: _product.toLowerCase(), active: true}).select('-createdAt -updatedAt -__v');
  // return this.findOne({product: _product, active: true}).select('-createdAt -updatedAt -__v');
});

VisaCategorySchema.methods.toJSON = function () {
  const visaObject = this.toObject();
  const {__v, ...visa} = visaObject;

  return visa;
};

module.exports = mongoose.model('VisaCategory', VisaCategorySchema);
