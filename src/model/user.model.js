const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const {rolesValidos, roles} = require('./../config/config');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {type: String, unique: true, required: [true, 'El correo es necesario'], lowercase: true},
    first_name: {type: String, required: [true, 'El Nombre es necesario']},
    last_name: {type: String, required: [true, 'El Apellido es necesario']},
    password: {type: String, required: [true, 'La contraseña es necesario']},
    img: {type: String, required: false, default: ''},
    bio: {type: String, required: false, default: ''},
    active: {type: Boolean, default: true},
    role: {type: String, default: roles.client, enum: rolesValidos, uppercase: true},
    client: {type: Schema.Types.ObjectId, ref: 'Client', default: null, required: false},
    account_expiration: {type: Date, default: null},
  },
  {timestamps: true, collection: 'users'}
);

UserSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Hook to before to save user to encrypt password
 */
UserSchema.pre('save', async function (next) {
  const user = this;

  // validate is a new recorde and the profile is CLIENT_USER
  if (user.isNew && user.role === roles.client) {
    user.account_expiration = moment().add(2, 'months').hour(23).minute(59).second(59).toDate();
  }

  if (user.isModified('password')) {
    user.password = await this.encryptPassword(user.password);
  }
  return next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const user = this.getUpdate();
  const that = this.schema;

  if (user.password) {
    user.password = await that.methods.encryptPassword(user.password);
  }

  return next();
});

/**
 * Hook to after save user to replace the password
 */
UserSchema.post('save', function (next) {
  const user = this;
  user.password = ':)';

  return next;
});

/**
 * method of encript password
 */
UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

/**
 * method to verify password
 **/
UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * method of remove password to response
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);
