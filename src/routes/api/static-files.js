const express = require('express');
// Inicialización
const router = express.Router();

const path = require('path');
const fs = require('fs');
const auth = require('./../../middlewares/auth.guard');
const {uploadDirPhoto} = require('../../config/config');

/********************************************************
 * Static Files
 ********************************************************/

router.use('/files', [auth.isAuth], express.static(path.join(__dirname, '..', '..', 'public', 'processes')));
// router.use('/photo', [auth.isAuth], express.static(path.join(__dirname, '..', '..', 'public', 'users')));

router.use('/photo/:name', [auth.isAuth], (req, res, next) => {
  const name = req.params.name;

  const [nameFile, ext] = name.split('.');

  const pathImg = path.resolve(uploadDirPhoto, name);

  const prefijo = ext.includes('svg') ? `data:image/${ext}+xml;base64,` : `data:image/${ext};base64,`;

  let file = '';

  if (name && fs.existsSync(pathImg)) {
    file = prefijo + fs.readFileSync(pathImg, {encoding: 'base64'});
  }

  res.json({
    ok: true,
    data: file,
  });
});

module.exports = router;
