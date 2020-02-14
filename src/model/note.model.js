const mosngoose = require('mongoose');
const { Schema } = mosngoose;

var NoteSchemea = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mosngoose.model('Note', NoteSchemea);