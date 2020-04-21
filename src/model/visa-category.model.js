const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - name: string
 * - description: string
 * - active: boolean
 */

const VisaCategorySchema = new Schema({
    name: { type: String, required: [true, 'the name is required'], unique: true, uppercase: true },
    description: { type: String, required: false },
    active: { type: Boolean, default: true },
}, { timestamps: true, collection: 'visacategory' });

VisaCategorySchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

module.exports = mongoose.model('VisaCategory', VisaCategorySchema);