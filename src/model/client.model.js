const mongoose = require('mongoose');
const UserModel = require('./user.model');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');
const {titles, sexs, relationships} = require('../config/config');

const Schema = mongoose.Schema;

const max = moment().format('YYYY-MM-DD').toString();
const min = moment().subtract(80, 'years').format('YYYY-MM-DD').toString();

/**
 * - _id: ObjectId()
 * - first_name: string
 * - last_name: string
 * - title: string
 * - sex: string
 * - email: string, unique
 * - phone: string, (format)
 * - birthday: date
 * - age: number
 * - country_citizenship: string
 * - other_citizenship: string
 * - country_residence: string
 * - status_country_residence: string
 * - ?type: string, (dad, mom, daughter, son)
 * - active: boolean
 */
const ClientSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    first_name: {type: String, required: [true, 'First name is required']},
    last_name: {type: String, required: [true, 'Last  name is required']},
    title: {type: String, enum: titles, required: false},
    sex: {type: String, enum: sexs, required: false},
    email: {type: String, default: null, required: [false, 'The email is required'], lowercase: true},
    telephone: {type: String, required: [false, 'The phone number is required']},
    birthday: {type: Date, min, max, required: [false, 'The birthday is required']},
    age: {type: Number, default: null},
    country_citizenship: {type: String, required: false},
    other_citizenship: {type: String, default: '', required: false},
    country_residence: {type: String, required: false},
    status_residence: {type: String, required: false},
    status_residence_other: {type: String, default: '', required: false},
    relationship: {type: String, enum: relationships, required: [false, 'The relationship is required'], uppercase: true},
    active: {type: Boolean, default: false},
  },
  {timestamps: true, id: false, collection: 'clients'}
);

ClientSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * method to validate if visa_categorie ref exist in the your collection
 */
ClientSchema.path('user').validate(async function (value) {
  const val = await UserModel.findById(value);
  return !val ? false : true;
}, `{PATH} is invalid`);

/**
 * Hook to before to save user to encrypt password
 */
ClientSchema.pre('save', async function (next) {
  const client = this;

  if (client.status_residence != 5) {
    // verificacion y borado de informacion del campo
    client.status_residence_other = '';
  }

  if (client.isModified('birthday')) {
    // var nacimiento = moment( birthday, "YYYY-MM-DD");
    var nacimiento = moment(client.birthday);
    var hoy = moment();
    client.age = hoy.diff(nacimiento, 'years');
  }

  return next();
});

ClientSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('Client', ClientSchema);
