const CouponService = require('../services/coupon.services');
const {roles, formats} = require('../config/config');
const moment = require('moment');
const _ = require('underscore');
const {use} = require('../routes/api/coupons');

async function getCouponList(req, res, next) {
  try {
    const user = req.user;

    // const _date = moment(req.query.date, 'ddd MMM DD YYYY HH:mm:ss Z'); // 'Wed Aug 19 2020 00:00:00 GMT-0400';
    // const _date = req.query.date ? moment(req.query.date, formats.input) : moment();
    const _date = moment();

    let filter = {};

    switch (user.role) {
      case roles.admin:
        break;

      case roles.user:
        filter = {expiration: {$gte: _date.toDate()}, 'share.to': user._id};
        break;

      default:
        filter = {activation: {$lte: _date.toDate()}, expiration: {$gte: _date.toDate()}, 'share.to': user._id};
        break;
    }

    // if (user.role === roles.admin) {
    //   filter = {activation: {$lte: _date.toDate()}, expiration: {$gte: _date.toDate()}, 'share.to': user._id};
    // }

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
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createCoupn(req, res, next) {
  try {
    const user = req.user;
    const body = req.body;

    // const share = transformShare(body.share, user._id);
    const share = await CouponService.transformListData(body.share, user._id);

    const activation = moment(body.activation).hour(00).minute(00);
    const expiration = moment(body.expiration).hour(23).minute(59);

    const inputs = {...body, activation, expiration, share};

    const data = await CouponService.createCoupon(inputs);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editCoupon(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id || null;
    let body = _.pick(req.body, ['share']);

    let coupon;

    if (user.role === roles.admin) {
      const body = _.pick(req.body, ['percent', 'group', 'code', 'activation', 'expiration', 'share']);
      coupon = await CouponService.editCoupon(id, body);
    } else {
      coupon = await CouponService.getCouponId(id);
    }

    if (!coupon) {
      throw {
        status: 400,
        ok: false,
        message: `Coupon no encontrado`,
      };
    }

    /**
     * Manejo listados para el from en administrador
     */

    // TODO: obtener el listado de los usuarios "(to)" que fueron asignados por el usuario "(from)" caso admin
    const listFrom = CouponService.filterListFrom(coupon.share, user._id);

    // TODO: obtener el listado de los items nuevos (body.share) para adicionar en la lista coupon.share
    const newItemsList = CouponService.newListItems(listFrom, body.share, user._id);

    let deleteItemList = CouponService.deleteListItems(listFrom, body.share);

    if (user.role === roles.admin) {
      const newDelete = CouponService.deleteRelatedItems(coupon.share, deleteItemList);
      deleteItemList = deleteItemList.concat(newDelete);
    }

    coupon.addItemsShare(newItemsList);

    coupon.deleteItemsShare(deleteItemList);

    await coupon.save().then((model) => {
      return model
        .populate([
          {path: 'share.to', select: 'role first_name last_name email'},
          {path: 'share.from', select: 'role first_name last_name email'},
        ])
        .execPopulate();
    });

    res.json({
      ok: true,
      data: coupon,
    });
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
    ok: false,
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
  editCoupon,
  deleteCoupon,
  validCoupon,
};

/************************************************
 *  Internal Metodos
 ************************************************/

/**
 * Method to transform input list to data structure to save
 */
function transformShare(list, from) {
  return list.map((el) => ({
    to: el,
    from,
  }));
}
