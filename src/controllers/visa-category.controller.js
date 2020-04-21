/************************************************
 *  Importaciones
 ************************************************/
const VisaCategory = require('../model/visa-category.model');
const VisaCategoryService = require('../services/visa-category.services');
const moment = require('moment');

async function getVisaCateories(req, res, next) {

    const listVisaCategories = await VisaCategory.find();

    res.status(200).json({
        ok: true,
        message: 'getVisaCateories',
        list: listVisaCategories

    });
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
        res.status(500).json({
            ok: false,
            message: 'getVisaCateoryId',
            error

        });
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
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
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
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
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
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }

}



module.exports = {
    getVisaCateories,
    getVisaCateoryId,
    createVisaCateory,
    editVisaCateory,
    deleteVisaCateory,
}