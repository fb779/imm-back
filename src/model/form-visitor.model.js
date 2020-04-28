const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const FormVisitorSchema = new Schema({
    process: { type: Schema.Types.ObjectId, ref: 'Process', unique: true, required: [true, 'The process is required'] },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The user is required'] },
    destiny: { type: String, required: true },
    marital_status: { type: String, required: true },
    number_accompanying: { type: Number, default: 0, required: false },
    // number_children: { type: Number, default: null, required: false },
    // spouse_accompanying: { type: String, default: '', required: false },
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

module.exports = mongoose.model('FormVisitor', FormVisitorSchema);