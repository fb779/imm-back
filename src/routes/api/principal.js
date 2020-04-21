var express = require('express');

// Inicialización
var router = express.Router();

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