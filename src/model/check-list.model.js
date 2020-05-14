const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - name: string
 * - description: string
 * - listVisaCategories: Array()
 */
const CheckListSchema = new Schema({
  name: { type: String, required: [true, 'the name is required'], unique: true, uppercase: true },
  description: { type: String, required: false },
  group: { type: String, default: 'Others', required: true },
  visa_categories: [{ type: Schema.Types.ObjectId, ref: 'VisaCategory', required: false }],
  required: { type: Boolean, default: false },
}, { timestamps: true, collection: 'checklist' });

CheckListSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

module.exports = mongoose.model('CheckList', CheckListSchema);