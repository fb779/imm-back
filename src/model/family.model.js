const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// const moment = require('moment');
const { relationships } = require('../config/config');

const Schema = mongoose.Schema;

/**
 * - _id: ObjectId()
 * - process: ObjectId()
 * - client: ObjectId()
 * - relationship: enum
 */
const FamilySchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: [true, 'The client is required'], unique: true },
    process: { type: Schema.Types.ObjectId, ref: 'Process', required: [true, 'The process is required'] },
    // relationship: {
    //     type: String,
    //     enum: relationships,
    //     required: [true, 'The relationship is required'],
    //     uppercase: true,
    //     // validate: {
    //     //     validator: validRelationship,
    //     //     mesages: 'The relationship is not unique in the family members'
    //     // }
    // },
}, { timestamps: true, collection: 'family' });

FamilySchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

/**
 * Funcion para validar la unicidad de los miembros de la familia registrados
 * @param {*} arg
 */
// async function validRelationship(arg) {
//     var numMember = null;
//     const familyMembers = await (await family.find({ process: this.process })).filter(({ relationship }) => relationship === arg);
//     console.log(relationships.values);

//     const [father, mother, brother, sister, wife, son, daugther] = relationships.values;

//     switch (arg) {
//         case father:
//         case mother:
//             {
//                 numMember = 1;
//             }
//             break;
//         default:
//             {

//             }
//             break;
//     }

//     console.log('numero de miembros permitidos ', numMember);


//     return false;

//     return !(familyMembers.length > numMember);
// }

const family = mongoose.model('Family', FamilySchema);

module.exports = family;