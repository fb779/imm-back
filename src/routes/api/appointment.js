const express = require('express');

const router = express.Router();

/************************************************
 *  Importaciones
 ************************************************/
const AppointmentCtrl = require('./../../controllers/appointment.controller');
const auth = require('./../../middlewares/auth.guard');

/************************************************
 *  CRUD's especiales
 ************************************************/

/************************************************
 *  CRUD basico para el recurso
 ************************************************/

router.use([auth.isAuth]);

router.get('/', [], AppointmentCtrl.getAppointment);

router.get('/valid', [], AppointmentCtrl.validAppointment);

router.get('/:id', [], AppointmentCtrl.getAppointmentId);

router.post('/', [], AppointmentCtrl.createAppointment);

router.put('/:id', [], AppointmentCtrl.editAppointment);

router.delete('/:id', [], AppointmentCtrl.deleteAppointment);

module.exports = router;
