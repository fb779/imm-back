const Coupon = require('../model/coupon.model');
const _ = require('underscore');
const moment = require('moment');

/**
 * Funciones relacionadas con el CRUD
 */

function getCouponList(_filters) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Coupon.find(_filters)
        .populate([
          {path: 'share.to', select: 'role first_name last_name email'},
          {path: 'share.from', select: 'role first_name last_name email'},
        ])
        .sort({activation: -1});

      return resolve(data);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to coupon list',
        errors: error,
      });
    }
  });
}

function getCouponId(_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Coupon.findById(_id).populate([
        {path: 'share.to', select: 'role first_name last_name email'},
        {path: 'share.from', select: 'role first_name last_name email'},
      ]);

      return resolve(data);
    } catch (error) {
      reject({
        status: 400,
        message: `Error, the coupon does not exist`,
        errors: error,
      });
    }
  });
}

// crear nuevo appointment
function createCoupon(newCoupon) {
  return new Promise(async (resolve, reject) => {
    try {
      const body = _.pick(newCoupon, ['code', 'percent', 'activation', 'expiration', 'share']);

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
      const body = _.pick(newAppointment, ['code', 'percent', 'activation', 'expiration']);
      const coupon = await Coupon.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'});
      resolve(coupon);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit Coupon',
        errors: error,
      });
    }
  });
}

// eliminar un appointment
function deleteCoupon(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const coupon = await Coupon.findByIdAndRemove(id);
      resolve(coupon);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to delete Coupon',
        errors: error,
      });
    }
  });
}

/**
 * Funciones de validacion de informacion
 */

function validCoupon(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      const coupon = await Coupon.find(filter);

      const rta = coupon.length > 0 ? true : false;

      resolve(rta);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to valid coupon',
        errors: error,
      });
    }
  });
}

/**
 * Funciones de tratamiento de datos
 */

//  creacion de los nuevos elementos de la lista
function transformListData(newList, from) {
  return Coupon.transformListData(newList, from);
}

// filtrado de los elementos de un usuario especifico
function filterListFrom(listShare, from) {
  return listShare.filter((el) => el.from._id.toString() === from);
}

// generacion del listado de items para adicionar
function newListItems(listFrom, listShare, from) {
  const tmpList = listFrom.map((el) => el.to._id.toString());
  return transformListData(
    listShare.filter((el) => !tmpList.includes(el)),
    from
  );
}

// generacion del listado de items para adicionar
function deleteListItems(listFrom, listShare) {
  return listFrom.filter((el) => !listShare.includes(el.to._id.toString())).map((el) => el._id.toString());
}

function deleteRelatedItems(listShare, listDelete) {
  // TODO: obtener los id de usuario de los elementos a eliminar
  const related = listShare.filter((item) => listDelete.includes(item._id.toString())).map((el) => el.to._id.toString());

  // TODO: obtener los id de los objetos a eliminar
  return listShare.filter((item) => related.includes(item.from._id.toString())).map((el) => el._id.toString());
}

module.exports = {
  getCouponList,
  getCouponId,
  createCoupon,
  editCoupon,
  deleteCoupon,
  // disableCoupon,
  validCoupon,
  transformListData,
  // metodos para el manejo de las listas
  filterListFrom,
  newListItems,
  deleteListItems,
  deleteRelatedItems,
};
