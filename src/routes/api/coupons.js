const express = require('express');

const couponCtrl = require('../../controllers/coupons.controller');

const router = express.Router();

router.get('/', couponCtrl.getCouponList);
router.get('/valid', couponCtrl.validCoupon);
router.get('/:id', couponCtrl.getCoupnId);
router.post('/', couponCtrl.createCoupn);
router.put('/:id', couponCtrl.editCoupon);
router.delete('/:id', couponCtrl.deleteCoupon);

module.exports = router;
