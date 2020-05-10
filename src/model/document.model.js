const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const { statusDocument, typeDocument } = require('../config/config')


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
    process: { type: Schema.Types.ObjectId, ref: 'Process', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    checklist: { type: Schema.Types.ObjectId, ref: 'CheckList', required: true },
    name: { type: String, required: [true, 'the name is required'], uppercase: true },
    status: { type: String, default: 'CREATE', enum: statusDocument, uppercase: true },
    extension: { type: String, required: [false, 'the name is required'], uppercase: true },
    directory: { type: String, required: [false, 'the directory is required'] },
    comments: [
        // { type: Schema.Types.ObjectId, ref: 'Comments', required: true }
        {
            // date: { type: Date, default: moment() },
            date: { type: Date, default: Date.now },
            comment: { type: String, required: true },
        }
    ],
}, { timestamps: true, collection: 'document' });

DocumentSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

DocumentSchema.index({ client: 1, checklist: 1 }, { unique: true });

module.exports = mongoose.model('Document', DocumentSchema);