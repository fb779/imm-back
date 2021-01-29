const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const statusValues = {
  active: 'ACTIVE',
  invalid: 'INVALID',
};

const statusValidos = {
  values: ['ACTIVE', 'INVALID'],
  message: `{VALUE} doesn't a role valid`,
};

const UserResetSchema = new Schema(
  {
    email: {type: String, required: [true, 'Email is requiered'], lowercase: true},
    token: {type: String, required: [true, 'Token is required']},
    expire: {type: Number},
    status: {type: Boolean, default: true},
    // expire: {type: Date},
    // status: {type: String, default: statusValues.active, enum: statusValidos, uppercase: true},
    // user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  },
  {timestamps: true, collection: 'resetpassword', toObject: {virtuals: true}, toJSON: {virtuals: true}}
);

// UserResetSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

/**
 * Virtual field to
 */
UserResetSchema.path('status').get(function (value) {
  const {expire: exp} = this;
  const td = moment().valueOf();
  return exp > td && value;
});

module.exports = mongoose.model('UserReset', UserResetSchema);
