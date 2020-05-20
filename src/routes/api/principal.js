var express = require('express');

const mailServices = require('../../services/nodemailer');

// Inicialización
var router = express.Router();

router.get('/', async(req, res, next) => {
  try {

    mOption = {
      to: "bar@example.com",
      subject: "Hello testing",
      html: mailServices.getPlantilla('bar@example.com', 'perritolindo')
    }

    const info = await mailServices.sendMail(mOption);

    console.log(info)
      // console.log(info.messageId);

    return res.status(200).json({
      ok: true,
      mensaje: `Enviado el email`
    });

  } catch (error) {

  }
});

// router.get('/:nombre?', (req, res, next) => {
//     var nombre = req.params.nombre || '';
//         // console.log(nombre);
//     return res.status(200).json({
//         ok: true,
//         mensaje: `Petición exitosa immigrative, hola ${nombre}...`
//     });
// });

// router.get('/:nombre?', metodo);

// metodo = (req, res, next) => {
//     res.status(200).json({});
// }

module.exports = router;