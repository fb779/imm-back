const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {isArray} = require('underscore');

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {type: String, required: [true, 'the code is required'], unique: true},
    percent: {type: Number, default: 0},
    activation: {type: Date, required: true},
    expiration: {type: Date, required: true},
    share: [
      {
        to: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      },
    ],
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

/**
 * Metodo para adicionar un item al listado de share
 *
 * @param {*} list // list[{to: ID, from: ID}]
 */
CouponSchema.methods.addItemsShare = async function (list = []) {
  const self = this;

  list.forEach((el) => {
    self.share.push(el);
  });
};

/**
 * Metodo para eliminar un item del listado de share por su identificador
 *
 * @param {*} list // list[Id]
 */
CouponSchema.methods.deleteItemsShare = async function (list = []) {
  const self = this;

  list.forEach((el) => {
    self.share.pull(el);
  });
};

// CouponSchema.methods.saveAndPopulate = async function () {
//   const self = this;
//   self.save().then((model) =>
//     model
//       .populate([
//         {path: 'share.to', select: 'role first_name last_name email'},
//         {path: 'share.from', select: 'role first_name last_name email'},
//       ])
//       .execPopulate()
//   );
// };

/**
 * Method to transform input list to data structure to save
 * @param {*} list
 * @param {*} from
 */
CouponSchema.static('transformListData', (list, from) => {
  try {
    return list.map((el) => ({
      to: el,
      from,
    }));
  } catch (e) {
    throw e;
  }
});

module.exports = mongoose.model('Coupon', CouponSchema);
