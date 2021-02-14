const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - process: ObjectId()
 * - client: ObjectId()
 */
const FamilySchema = new Schema(
  {
    client: {type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The client is required']},
    process: {type: Schema.Types.ObjectId, ref: 'Process', required: [true, 'The process is required']},
  },
  {timestamps: true, collection: 'family'}
);

FamilySchema.plugin(uniqueValidator, {message: '{PATH} is not unique'});

FamilySchema.index({process: 1, client: 1}, {unique: true});

module.exports = mongoose.model('Family', FamilySchema);
