const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - name: string
 * - description: string
 * - listVisaCategories: Array()
 */
const CheckListSchema = new Schema(
  {
    name: {type: String, required: [true, 'the name is required'], unique: true, uppercase: true},
    description: {type: String, required: false},
    group: {type: String, default: null, uppercase: true},
    visa_categories: [{type: Schema.Types.ObjectId, ref: 'VisaCategory', required: false}],
    required: {type: Boolean, default: false},
    state: {type: Boolean, default: true},
  },
  {timestamps: true, collection: 'checklist'}
);

CheckListSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

CheckListSchema.methods.toJSON = function () {
  const checkListObject = this.toObject();
  delete checkListObject.createdAt;
  delete checkListObject.updatedAt;
  delete checkListObject.__v;
  return checkListObject;
};

module.exports = mongoose.model('CheckList', CheckListSchema);
