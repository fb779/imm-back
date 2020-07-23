const mongoose = require('mongoose');
const moment = require('moment');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - process: Process
 * - user: User
 * - message: string
 * - date: Date
 */

const WebChatSchema = new Schema({
  process: { type: Schema.Types.ObjectId, ref: 'Process', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: [true, 'the message is required'] },
  date: { type: Date, default: moment() },
  // date: { type: Date, default: Date.now() },
}, { timestamps: true, collection: 'webchat' });



module.exports = mongoose.model('WebChat', WebChatSchema);