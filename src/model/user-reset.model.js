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
  const td = moment().unix();
  return exp > td && value;
});

// UserResetSchema.virtual('status').get(function () {
//   // const {token} = this;

//   // const buff = Buffer.from(token.split('.')[1], 'base64');
//   // const data = JSON.parse(buff.toString('utf-8'));
//   // const {exp} = data;

//   // return !(exp <= moment().unix());
//   const {expire: exp} = this;
//   return !(exp <= moment().unix());
// });

// async function decodeTokenAndValidDate(token) {
//   const tk = await decodeResetToken(token);
//   return tk;
// }
/**
 * Hook to before to save user to encrypt password
 */
// UserResetSchema.pre('save', async function (next) {
//   const user = this;

//   if (user.isModified('password')) {
//     user.password = await this.encryptPassword(user.password);
//   }
//   return next();
// });

// UserResetSchema.pre('findOneAndUpdate', async function (next) {
//   const user = this.getUpdate();
//   const that = this.schema;

//   if (user.password) {
//     // user.password = that.methods.encryptPasswordSync(user.password);
//     user.password = await that.methods.encryptPassword(user.password);
//   }

//   return next();
// });

/**
 * Hook to after save user to replace the password
 */
// UserResetSchema.post('save', function (next) {
//   const user = this;
//   user.password = ':)';

//   return next;
// });

/**
 * method of encript password
 */
// UserResetSchema.methods.encryptPassword = async (password) => {
//   const salt = await bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(password, salt);
//   return hash;
// };

/**
 * method to verify password
 **/
// UserResetSchema.methods.verifyPassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

/**
 * method of remove password to response
 */
// UserResetSchema.methods.toJSON = function () {
//   const userObject = this.toObject();
//   delete userObject.password;
//   delete userObject.createdAt;
//   delete userObject.updatedAt;
//   delete userObject.__v;
//   return userObject;
// };

module.exports = mongoose.model('UserReset', UserResetSchema);
