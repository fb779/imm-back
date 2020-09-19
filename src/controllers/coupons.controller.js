const CouponService = require('../services/coupon.services');
const {roles, formats} = require('../config/config');
const moment = require('moment');

async function getCouponList(req, res, next) {
  try {
    const user = req.user;

    // const _date = moment(req.query.date, 'ddd MMM DD YYYY HH:mm:ss Z'); // 'Wed Aug 19 2020 00:00:00 GMT-0400';
    // const _date = req.query.date ? moment(req.query.date, formats.input) : moment();
    const _date = moment();

    let filter = {};

    if (user.role !== roles.admin) {
      filter = {activation: {$lte: _date.toDate()}, expiration: {$gte: _date.toDate()}};
    }

    const data = await CouponService.getCouponList(filter);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getCoupnId(req, res, next) {
  try {
    const id = req.params.id || null;

    const data = await CouponService.getCouponId(id);

    if (!data) {
      throw {
        status: 400,
        ok: false,
        message: `Coupon not found`,
      };
    }

    res.json({
      ok: true,
      message: `recibido para la prueba de getCoupnId`,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createCoupn(req, res, next) {
  try {
    const body = req.body;

    const activation = moment(body.activation).hour(00).minute(00).toDate();
    const expiration = moment(body.expiration).hour(23).minute(59).toDate();

    const inputs = {...body, activation, expiration};

    const data = await CouponService.createCoupon(inputs);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editCliente(req, res, next) {
  try {
    res.json({ok: true, message: `recibido para la prueba de editCliente`});
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteCoupon(req, res, next) {
  try {
    const id = req.params.id;

    const data = await CouponService.deleteCoupon(id);

    if (!data) {
      throw {
        status: 404,
        ok: false,
        message: `Coupon not found.`,
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

async function validCoupon(req, res, next) {
  try {
    const code = req.query.code;

    if (!code) {
      throw {
        status: 400,
        ok: false,
        message: 'Error in the information',
      };
    }

    const filter = {code};

    const data = await CouponService.validCoupon(filter);

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
    ok: true,
    message: 'Error services coupon',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/
module.exports = {
  getCouponList,
  getCoupnId,
  createCoupn,
  // editCliente,
  deleteCoupon,
  validCoupon,
};
