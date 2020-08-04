/************************************************
 *  Importaciones
 ************************************************/
// const Client = require('../model/client.model');
// const ClientService = require('../services/client.services');

const Appointment = require('../model/appointment.model');
const AppointmentService = require('../services/appointment.services');
const moment = require('moment');

async function getAppointment(req, res, next) {
  try {
    res.status(200).json({ ok: true, message: 'Salida de prueba correcta getAppointment' });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getAppointmentId(req, res, next) {
  try {
    res.status(200).json({ ok: true, message: 'Salida de prueba correcta getAppointmentId' });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function validAppointment(req, res, next) {
  try {
    res.status(200).json({ ok: true, message: 'Salida de prueba correcta validAppointment' });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createAppointment(req, res, next) {
  try {
    res.status(200).json({ ok: true, message: 'Salida de prueba correcta createAppointment' });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editAppointment(req, res, next) {
  try {
    res.status(200).json({ ok: true, message: 'Salida de prueba correcta editAppointment' });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteAppointment(req, res, next) {
  try {
    res.status(200).json({ ok: true, message: 'Salida de prueba correcta deleteAppointment' });
  } catch (error) {
    errorHandler(error, res);
  }
}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
      error: error.errors,
    });
  }
  return res.status(500).json({
    ok: true,
    message: 'Error services client',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/
module.exports = {
  getAppointment,
  getAppointmentId,
  validAppointment,
  createAppointment,
  editAppointment,
  deleteAppointment,
};
