const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { statusDocument, typeDocument } = require('./../config/config')


const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - _id_checklist: ObjectId()
 * - _id_client: ObjectId()
 * - name: string
 * - description: string
 * - extension: string
 * - directory: string
 * - state: string
 */

const DocumentSchema = new Schema({
    checklist: { type: Schema.Types.ObjectId, ref: 'CheckList', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    name: { type: String, required: [true, 'the name is required'], unique: true, uppercase: true },
    description: { type: String, required: false, uppercase: true },
    extension: { type: String, required: [true, 'the name is required'], unique: true, uppercase: true },
    directory: { type: String, required: [true, 'the directory is required'], unique: true, uppercase: true },
    status: { type: String, default: 'CREATE', enum: statusDocument, uppercase: true },
}, { timestamps: true, collection: 'document' });

DocumentSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

module.exports = mongoose.model('Document', DocumentSchema);