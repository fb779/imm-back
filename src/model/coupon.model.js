const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {type: String, required: [true, 'the code is required'], unique: true},
    percent: {type: Number, default: 0},
    activation: {type: Date, required: true},
    expiration: {type: Date, required: true},
    share: [{type: Schema.Types.ObjectId, ref: 'User', required: false}],
    group: {type: String, default: '', lowercase: true},
    description: {type: String, default: '', required: false},
    state: {type: Boolean, default: true},
  },
  {timestamps: true, collection: 'counpon'}
);

CouponSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

CouponSchema.methods.toJSON = function () {
  const couponObject = this.toObject();
  delete couponObject.createdAt;
  delete couponObject.updatedAt;
  delete couponObject.__v;
  return couponObject;
};

module.exports = mongoose.model('Coupon', CouponSchema);
