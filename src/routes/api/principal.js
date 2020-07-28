var express = require('express');

const mailServices = require('../../services/nodemailer');

// Inicialización
var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    mOption = {
      to: 'bar@example.com',
      data: {
        user: 'bar@example.com',
        password: '123456',
      },
    };

    const info = await mailServices.sendMail(mailServices.templates.newuser, mOption);

    // console.log(info);
    // console.log(info.messageId);

    return res.status(200).json({
      ok: true,
      mensaje: `Enviado el email`,
    });
  } catch (error) {}
});

module.exports = router;
