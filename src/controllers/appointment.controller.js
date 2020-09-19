/************************************************
 *  Importaciones
 ************************************************/
const AppointmentService = require('../services/appointment.services');
const {roles, formats} = require('../config/config');
const moment = require('moment');

async function getAppointment(req, res, next) {
  try {
    const user = req.user;

    // const _date = moment(req.query.date, 'ddd MMM DD YYYY HH:mm:ss Z'); // 'Wed Aug 19 2020 00:00:00 GMT-0400';
    const _date = req.query.date ? moment(req.query.date, formats.input) : moment();

    // let filter = {date: {$gte: _date.subtract(1, 'day').toDate(), $lte: _date.add(1, 'month').toDate()}};
    let filter = {date: {$gte: _date.format(formats.output).toString(), $lte: _date.add(1, 'month').toDate()}};

    if (user.role === roles.user) {
      filter['consultant'] = user._id;
    }

    if (user.role === roles.client) {
      filter['client'] = user.client;
    }

    const data = await AppointmentService.getAppointments(filter);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getAppointmentId(req, res, next) {
  try {
    const id = req.params.id;

    const data = await AppointmentService.getAppointmentId(id);

    if (!data) {
      throw {
        status: 400,
        ok: false,
        message: `Appointment not found`,
      };
    }

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function validAppointment(req, res, next) {
  try {
    const user = req.user;
    let date = req.query.date ? moment(req.query.date, formats.input) : null;
    const hour = req.query.hour || null;

    if (!date.isValid() || !hour) {
      throw {
        status: 400,
        ok: false,
        message: 'Error in the information',
      };
    }

    const filter = {date: {$gte: date.hour(0).toDate(), $lte: date.hour(23).toDate()}, hour};

    if (user.role === roles.user) {
      filter['consultant'] = user._id;
    }

    const data = await AppointmentService.validAppointment(filter);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createAppointment(req, res, next) {
  try {
    const body = req.body;

    body.date = moment(body.date).hour(body.hour.split(':')[0]).toDate();

    const data = await AppointmentService.createAppointment(body);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editAppointment(req, res, next) {
  try {
    const id = req.params.id;
    const body = req.body;

    const data = await AppointmentService.editAppointment(id, body);

    if (!data) {
      throw {
        status: 404,
        ok: false,
        message: `Appointment not found.`,
      };
    }

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteAppointment(req, res, next) {
  try {
    const id = req.params.id;

    const data = await AppointmentService.deleteAppointment(id);

    if (!data) {
      throw {
        status: 404,
        ok: false,
        message: `Appointment not found.`,
      };
    }

    res.status(200).json({
      ok: true,
      data,
    });
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
    ok: false,
    message: 'Error services appointment',
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
