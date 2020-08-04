const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const AppointmentCtrl = require('./../../controllers/appointment.controller');
const { isAuth } = require('./../../middlewares/auth.guard');

/************************************************
 *  CRUD's especiales
 ************************************************/

/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.use(isAuth);

router.get('/', [], AppointmentCtrl.getAppointment);

router.get('/:id', [], AppointmentCtrl.getAppointmentId);

router.get('/valid/:name', [], AppointmentCtrl.validAppointment);

router.post('/', [], AppointmentCtrl.createAppointment);

router.put('/:id', [], AppointmentCtrl.editAppointment);

router.delete('/:id', [], AppointmentCtrl.deleteAppointment);

module.exports = router;
