/********************************************************
 *  imports
 ********************************************************/
const express = require('express');
const path = require('path');
// const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config')

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
// app.use(express.urlencoded({ extended: false }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

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


// middleware to session
// manejo de sessiones
// app.use(session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }));

/********************************************************
 *  Globals variables
 ********************************************************/

/********************************************************
 *  routes
 ********************************************************/
app.use(require('./routes/routes'));

/********************************************************
 * Static Files
 ********************************************************/
// app.use('/documents', express.static(path.join(__dirname, 'public')));

module.exports = app;