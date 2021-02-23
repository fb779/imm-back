/********************************************************
 *  imports
 ********************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');

/********************************************************
 *  initilizations
 ********************************************************/
const app = express();

/********************************************************
 *  Settings
 ********************************************************/
app.set('port', config.port);

/********************************************************
 *  Middlewares
 ********************************************************/
// configuracion y permitir las rutas de tipos get, post, put y delete
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     // res.header("Allow", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
// });

app.use(cors());

// parse application/x-www-form-urlencoded
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

/********************************************************
 *  Globals variables
 ********************************************************/

/********************************************************
 *  routes
 ********************************************************/
app.use(require('./routes/routes'));

module.exports = app;
