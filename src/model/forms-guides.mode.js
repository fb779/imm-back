const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');
const { typeFiles } = require('../config/config');

const Schema = mongoose.Schema;

/**
 * - _id_process: ObjectId()
 * - type: string (FORM,GUIDE)
 * - title: string
 * - name: string
 * - description: string
 */
const FormsGuidesSchema = new Schema({
    process: { type: Schema.Types.ObjectId, ref: 'Process', required: [true, 'The process is required'] },
    name: { type: String, required: [true, 'First name is required'], },
    description: { type: String, required: [false, 'First name is required'], },
    type: { type: String, enum: typeFiles, required: [true, 'The type is required'], lowercase: true },
    directory: { type: String, unique: true, required: [true, 'The directory is required'] },
}, { timestamps: true, collection: 'formsguides' });

FormsGuidesSchema.plugin(uniqueValidator, { message: 'File already exist in {PATH}, File is not unique' });

/**
 * Hook to before to save user to encrypt password
 */

// FormsGuidesSchema.pre('save', async function(next) {
//     const formsguides = this;
//     // if (formsguides.isNew){ }
//     // if (client.isModified('birthday')) {
//     //     // var nacimiento = moment( birthday, "YYYY-MM-DD");
//     //     var nacimiento = moment(client.birthday);
//     //     var hoy = moment();
//     //     client.age = hoy.diff(nacimiento, "years");
//     // }
//     return next();
// });

module.exports = mongoose.model('FormsGuides', FormsGuidesSchema);