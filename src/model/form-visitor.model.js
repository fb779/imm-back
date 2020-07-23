const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const FormVisitorSchema = new Schema({
  process: { type: Schema.Types.ObjectId, ref: 'Process', unique: true, required: [true, 'The process is required'] },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The user is required'] },
  destiny: { type: String, required: true },
  marital_status: { type: String, required: true },
  // number_accompanying: { type: Number, default: 0, required: false },
  purpose_visit: { type: String, required: true },
  letter_invitation: { type: String, required: true },
  stay_canada: { type: String, required: true },
  funds: { type: String, required: true },
  disease: { type: String, required: true },
  criminal_act: { type: String, required: true },
  refuse_canada: { type: String, required: true },
  comments: { type: String, required: false },
}, { timestamps: true, collection: 'form' });

FormVisitorSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

/**
 * Hook to before to save user to encrypt password
 */
// FormVisitorSchema.pre('save', async function(next) {
//     const form = this;

//     if (form.isModified('number_accompanying') || !form.number_accompanying) {
//         form.number_accompanying = 0;
//     }

//     return next();
// });

module.exports = mongoose.model('FormVisitor', FormVisitorSchema);