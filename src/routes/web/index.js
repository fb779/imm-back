const express = require('express');
const pathViews = 'public';

// Inicialización utiliza solo el modulo para generar las rutas
const router = express.Router();

router.get('/about', (req, res, next) => {
    res.render(`${pathViews}/about`, { title: 'Home Page' });
});

router.get('/', (req, res, next) => {
    res.render(`${pathViews}/index`, { title: 'Home Page' });
});

module.exports = router;