const express = require('express');
// const bodyParser = require('body-parser');

// Inicialización
const router = express.Router();

// router.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
// });

/********************************************************
 *  Middlewares
 ********************************************************/
// parse application/x-www-form-urlencoded
// router.use(bodyParser.urlencoded({ extended: true }));
// // parse application/json
// router.use(bodyParser.json());

// const api = require('./api/principal');
const login = require('./api/login');
const users = require('./api/users');

router.use('/api/v1/login', login);
router.use('/api/v1/users', users);

module.exports = router;