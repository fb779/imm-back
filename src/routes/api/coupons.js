const express = require('express');

const couponCtrl = require('../../controllers/coupons.controller');
const auth = require('./../../middlewares/auth.guard');

const router = express.Router();

router.get('/', [auth.isAuth], couponCtrl.getCouponList);
router.get('/valid', [auth.isAuth], couponCtrl.validCoupon);
router.get('/:id', [auth.isAuth], couponCtrl.getCoupnId);
router.post('/', [auth.isAuth], couponCtrl.createCoupn);
router.put('/:id', [auth.isAuth], couponCtrl.editCoupon);
router.delete('/:id', [auth.isAuth], couponCtrl.deleteCoupon);

module.exports = router;
