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
  extension: { type: String, required: [false, 'the name is required'], lowercase: true },
  file_name: { type: String, required: [false, 'the name is required'] },
  directory: { type: String, required: [false, 'the directory is required'] },
  comments: [{
    date: { type: Date, default: moment() },
    comment: { type: String, required: true },
  }],
}, { timestamps: true, collection: 'document', toJSON: { virtuals: true } });

DocumentSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

// DocumentSchema.virtual('comments_order').get(function() {
//   return this.comments.sort((a, b) => b.date - a.date).map(({ date, comment }) => ({ date: moment(date).format('YYYY-MM-DD hh:mm:ss a').toString(), comment }));
// });


DocumentSchema.index({ process: 1, client: 1, checklist: 1 }, { unique: true });


module.exports = mongoose.model('Document', DocumentSchema);