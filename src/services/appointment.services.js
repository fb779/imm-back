const Appointment = require('../model/appointment.model');
const _ = require('underscore');
const moment = require('moment');

function getAppointments(_filters) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Appointment.find(_filters)
        .populate([
          {path: 'consultant', select: '_id first_name last_name email'},
          {path: 'client', select: '_id first_name last_name email'},
        ])
        .sort({date: 1, hour: 1});

      return resolve(data);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error to create checklist',
        errors: error,
      });
    }
  });
}

function getAppointmentId(_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Appointment.findById(_id).populate([
        {path: 'consultant', select: '_id first_name last_name email'},
        {path: 'client', select: '_id first_name last_name email'},
      ]);

      return resolve(data);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error to create checklist',
        errors: error,
      });
    }
  });
}

// crear nuevo appointment
function createAppointment(newAppointment) {
  return new Promise(async (resolve, reject) => {
    try {
      const body = _.pick(newAppointment, ['consultant', 'client', 'date', 'hour', 'time']);
      const appointmet = await Appointment.create(body);
      // const appointmet = new Appointment(body);

      resolve(appointmet);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create Appointment',
        errors: error,
      });
    }
  });
}

// editar un appointment
function editAppointment(id, newAppointment) {
  return new Promise(async (resolve, reject) => {
    try {
      const body = _.pick(newAppointment, ['consultant', 'client', 'date', 'hour', 'time']);
      const appointmet = await Appointment.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'});
      resolve(appointmet);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit Appointment',
        errors: error,
      });
    }
  });
}

// eliminar un appointment
function deleteAppointment(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const appointmet = await Appointment.findByIdAndRemove(id);
      resolve(appointmet);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to delete Appointment',
        errors: error,
      });
    }
  });
}

function disableAppointment(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {status: false};
      const appointmet = await Appointment.findByIdAndUpdate(id, body, {new: true, runValidators: true});
      resolve(appointmet);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to delete Appointment',
        errors: error,
      });
    }
  });
}

function validAppointment(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      const appointmet = await Appointment.find(filter);

      const rta = appointmet.length > 0 ? true : false;

      resolve(rta);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to delete Appointment',
        errors: error,
      });
    }
  });
}

module.exports = {
  getAppointments,
  getAppointmentId,
  createAppointment,
  editAppointment,
  deleteAppointment,
  disableAppointment,
  validAppointment,
};
