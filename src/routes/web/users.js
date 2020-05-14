var express = require('express');
const pathViews = 'users';

// Inicialización
var router = express.Router();

router.get('/signin', (req, res, next) => {
  res.render(`${pathViews}/signin`);
});

router.get('/signup', (req, res, next) => {
  res.render(`${pathViews}/signup`);
});

module.exports = router;