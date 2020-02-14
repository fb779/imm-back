var express = require('express');
const pathViews = 'users';

// Inicialización
var router = express.Router();

router.get('/signin', (req, res, next) => {
    res.render(`${pathViews}/signin`);
    // res.send('Sign in');
});

router.get('/signup', (req, res, next) => {
    res.render(`${pathViews}/signup`);
    // res.send('Sing up');
});

module.exports = router;