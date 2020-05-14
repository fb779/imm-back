/************************************************
 *  Importaciones
 ************************************************/
const VisaCategory = require('../model/visa-category.model');
const VisaCategoryService = require('../services/visa-category.services');
const moment = require('moment');

async function getVisaCateories(req, res, next) {
  try {
    const listVisaCategories = await VisaCategory.find();

    res.status(200).json({
      ok: true,
      message: 'getVisaCateories',
      list: listVisaCategories
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getVisaCateoryId(req, res, next) {
  try {
    const id = req.params.id;

    const visa = await VisaCategory.findById(id);

    if (!visa) {
      return res.status(200).json({
        data: {
          ok: true,
          messages: 'Visa doesn\'t exist'
        }
      })
    }

    res.status(200).json({
      ok: true,
      message: 'getVisaCateoryId',
      visa

    });
  } catch (error) {
    errorHandler(error, res);
  }

}

async function createVisaCateory(req, res, next) {
  try {
    const body = req.body;

    const visa = await VisaCategoryService.createVisaCategory(body);

    res.status(200).json({
      ok: true,
      message: 'createVisaCateory',
      visa

    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editVisaCateory(req, res, next) {
  try {
    const id = req.params.id;
    const body = req.body;

    const visa = await VisaCategoryService.editVisaCategory(id, body);

    res.status(200).json({
      ok: true,
      message: 'edit Visa Cateory',
      visa

    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteVisaCateory(req, res, next) {
  try {
    const id = req.params.id;

    const visa = await VisaCategoryService.deleteVisaCategory(id);

    res.status(200).json({
      ok: true,
      message: 'deleteVisaCateory',
      visa
    });
  } catch (error) {
    errorHandler(error, res);
  }

}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
      error: error.errors
    })
  }
  return res.status(500).json({
    ok: true,
    message: 'error en el servicio de creacion del listado de documentos',
    error
  })
}

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
  getVisaCateories,
  getVisaCateoryId,
  createVisaCateory,
  editVisaCateory,
  deleteVisaCateory,
}