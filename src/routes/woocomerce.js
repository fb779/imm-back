/********************************************************
 * Definicion
 ********************************************************/
const { Router } = require('express');

const WoocommerceServices = require('../services/woocommerce.services');

// Inicialización
let router = Router();

router.get('/woocommerce/products', async(req, res, next) => {
  try {
    const data = await WoocommerceServices.getProducts();
    // console.log('llegada de productos de woocommerce', data);

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false });
  }
});

router.get('/woocommerce/:id', async(req, res, next) => {
  try {
    const _id = req.params.id;
    // console.log('llegada-request get');
    const data = await WoocommerceServices.getWebHooks(_id);

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false
    })
  }
});

router.post('/woocommerce', (req, res) => {
  try {
    const body = req.body;

    console.log('POST datos del webHook de woocommerce', body);

    return res.status(200).json({
      ok: true
    });
  } catch (error) {
    console.log(Object.keys(error));
    return res.status(500).json({ ok: false });
  }
});

module.exports = router;