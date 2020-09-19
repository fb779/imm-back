const Coupon = require('../model/coupon.model');
const _ = require('underscore');
const moment = require('moment');

function getCouponList(_filters) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Coupon.find(_filters)
        // .populate([{path: 'user', select: '_id first_name last_name email'}])
        .sort();

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

function getCouponId(_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Coupon.findById(_id).populate([
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
function createCoupon(newCoupon) {
  return new Promise(async (resolve, reject) => {
    try {
      const body = _.pick(newCoupon, ['code', 'percent', 'activation', 'expiration']);

      const appointmet = await Coupon.create(body);
      // const appointmet = new Coupon(body);

      resolve(appointmet);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create Coupon',
        errors: error,
      });
    }
  });
}

// editar un appointment
function editCoupon(id, newAppointment) {
  return new Promise(async (resolve, reject) => {
    try {
      const body = _.pick(newAppointment, ['consultant', 'client', 'date', 'hour', 'time']);
      const appointmet = await Coupon.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'});
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
function deleteCoupon(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const appointmet = await Coupon.findByIdAndRemove(id);
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

// function disableCoupon(id) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const body = {status: false};
//       const appointmet = await Coupon.findByIdAndUpdate(id, body, {new: true, runValidators: true});
//       resolve(appointmet);
//     } catch (error) {
//       reject({
//         status: 400,
//         message: 'Error to delete Appointment',
//         errors: error,
//       });
//     }
//   });
// }

function validCoupon(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      const coupon = await Coupon.find(filter);

      const rta = coupon.length > 0 ? true : false;

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
  getCouponList,
  getCouponId,
  createCoupon,
  editCoupon,
  deleteCoupon,
  // disableCoupon,
  validCoupon,
};
