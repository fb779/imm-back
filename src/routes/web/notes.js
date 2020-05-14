const express = require('express');
const pathViews = 'notes';

var Note = require('../../model/note.model');

// Inicialización
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Notas');
});

router.get('/add', (req, res, next) => {
  res.render(`${pathViews}/add-note`);



});

router.post('/new-note', (req, res, next) => {
  const { title, description } = req.body;

  note = new Note({ title, description });

  note.save((err, noteSave) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear una nota',
        errors: err
      });
    }

    return res.status(200).json({
      ok: true,
      nota: noteSave
    });
  });
});

module.exports = router;