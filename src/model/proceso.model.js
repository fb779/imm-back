const mongoose = require('mongoose');
const { statusVisa } = require('./../config/config');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - client: ObjectId()
 * - consultant: ObjectId()
 * - _id_visacategory: ObjectId()
 * - code: string
 * - status: strign
 * - active: boolena
 */
const ProcessSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The user is required'] },
    consultant: { type: Schema.Types.ObjectId, ref: 'User', required: [false, 'The consultan is required'] },
    visa_category: { type: Schema.Types.ObjectId, ref: 'VisaCategory', required: [true, 'The type visa is required'] },
    code: { type: String, uppercase: true },
    status: { type: String, default: 'ACTIVE', enum: statusVisa, uppercase: true },
    active: { type: Boolean, default: true },
}, { timestamps: true, collection: 'process' });

/**
 * Hook to before to save user to create a unique code
 */
ProcessSchema.pre('save', async function(next) {
    const process = this;

    if (this.isNew) {
        const list_process = await Process.find({ visa_category: process.visa_category }).countDocuments();
        process.code = `${process.visa_category.name}-${String(list_process + 1).padStart(10,'0')}`;

    }


    return next();
});

const Process = mongoose.model('Process', ProcessSchema);

module.exports = Process;