const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    consultant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: false },
    date: { type: Date, require: true },
    hour: { type: String, require: true },
    time: { type: Number, require: true },
    description: { type: String, required: false },
    state: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'appointment' }
);

AppointmentSchema.plugin(uniqueValidator, { message: '{PATH} is not unique' });

AppointmentSchema.methods.toJSON = function () {
  const checkListObject = this.toObject();
  delete checkListObject.createdAt;
  delete checkListObject.updatedAt;
  delete checkListObject.__v;
  return checkListObject;
};

module.exports = mongoose.model('Appointment', AppointmentSchema);
