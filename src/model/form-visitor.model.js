const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const typeVisa = {
    values: ['TURIST', 'VISITOR'],
    message: '{VALUE} is not valid'
};

const statusVisa = {
    values: ['ACTIVE', 'PROCESS', 'CLOSE'],
    message: '{VALUE} no es un estado permitido'
};

const FormVisitorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] },
    process: { type: Schema.Types.ObjectId, ref: 'Process', unique: true, required: [true, 'The process is required'] },
    title: { type: String, required: true },
    sex: { type: String, required: true },
    first_name: { type: String, required: true, uppercase: true },
    last_name: { type: String, required: true, uppercase: true },
    email: { type: String, required: [true, 'The email is required'], lowercase: true },
    telephone: { type: String, required: true },
    country_citizenship: { type: String, required: true },
    other_citizenship: { type: String, required: true },
    country_residence: { type: String, required: true },
    status_residence: { type: String, required: true },
    age: { type: String, required: true },
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

FormVisitorSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

module.exports = mongoose.model('FormVisitor', FormVisitorSchema);