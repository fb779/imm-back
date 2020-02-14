var express = require('express');

// Inicialización
var router = express.Router();

const users = require('./web/users');
const notes = require('./web/notes');
const index = require('./web/index');

router.use('/users', users);
router.use('/notes', notes);
router.use('/', index);

module.exports = router;