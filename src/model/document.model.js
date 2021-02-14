const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const {statusDocument, typesStatusDocument} = require('../config/config');

const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
  {
    process: {type: Schema.Types.ObjectId, ref: 'Process', required: true},
    client: {type: Schema.Types.ObjectId, ref: 'Client', required: true},
    checklist: {type: Schema.Types.ObjectId, ref: 'CheckList', required: true},
    name: {type: String, required: [true, 'the name is required'], uppercase: true},
    status: {type: String, default: typesStatusDocument.CREATE, enum: statusDocument, uppercase: true},
    extension: {type: String, required: [false, 'the name is required'], lowercase: true},
    file_name: {type: String, required: [false, 'the name is required']},
    directory: {type: String, required: [false, 'the directory is required']},
    comments: [
      {
        date: {type: Date, default: moment()},
        comment: {type: String, required: true},
      },
    ],
  },
  {timestamps: true, collection: 'document', toJSON: {virtuals: true}}
);

DocumentSchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

// DocumentSchema.index({process: 1, client: 1, checklist: 1}, {unique: true});
DocumentSchema.index({client: 1, checklist: 1}, {unique: true});

module.exports = mongoose.model('Document', DocumentSchema);
