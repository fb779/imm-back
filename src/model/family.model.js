const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// const moment = require('moment');
const { relationships } = require('../config/config');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - process: ObjectId()
 * - client: ObjectId()
 */
const FamilySchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The client is required'], unique: true },
    process: { type: Schema.Types.ObjectId, ref: 'Process', required: [true, 'The process is required'] },
}, { timestamps: true, collection: 'family' });

FamilySchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

module.exports = mongoose.model('Family', FamilySchema);