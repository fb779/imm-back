const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const typeVisa = {
    values: ['TURIST', 'VISITOR'],
    message: '{VALUE} is not valid'
};

const statusVisa = {
    values: ['ACTIVE', 'PROCESS', 'CLOSE'],
    message: '{VALUE} no es un estado permitido'
};

const ProcessSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is required'] },
    consultan: { type: Schema.Types.ObjectId, ref: 'User', required: [false, 'The user is required'] },
    type_visa: { type: String, enum: typeVisa, uppercase: true, required: [true, 'The type visa is required'] },
    status: { type: String, default: 'ACTIVE', enum: statusVisa, uppercase: true },
    active: { type: Boolean, default: true },
    description: { type: String, required: false },
}, { timestamps: true, collection: 'process' });


module.exports = mongoose.model('Process', ProcessSchema);