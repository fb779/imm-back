const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const FormStudySchema = new Schema({
    process: { type: Schema.Types.ObjectId, ref: 'Process', unique: true, required: [true, 'The process is required'] },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The user is required'] },
    destiny: { type: String, required: true },
    marital_status: { type: String, required: true },
    number_children: { type: String, required: true },
    spouse_accompanying: { type: String, required: true },
    purpose_visit: { type: String, required: true },
    letter_invitation: { type: String, required: true },
    stay_canada: { type: String, required: true },
    funds: { type: String, required: true },
    disease: { type: String, required: true },
    criminal_act: { type: String, required: true },
    refuse_canada: { type: String, required: true },
    comments: { type: String, required: false },
}, { timestamps: true, collection: 'form' });

FormStudySchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

module.exports = mongoose.model('FormStudy', FormStudySchema);