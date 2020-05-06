/************************************************
 *  Importaciones
 ************************************************/
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const { uploadDir, typeFilesUpload } = require('./../config/config');

const ProcessService = require('../services/process.services');
const ClientService = require('../services/client.services');
const DocumentServices = require('../services/document.services');
const FormsGuidesService = require('../services/forms-guides.services');


/************************************************
 *  Deficnicion de metodos
 ************************************************/
async function getFormsGuidesByProcess(req, res, next) {
    try {
        const type = req.params.type;
        const id_process = req.params.id_process;

        const list = await FormsGuidesService.getformsGuidesByProcess(id_process, type);

        res.status(200).json({
            ok: true,
            list
        })
    } catch (error) {
        errorHandler(error, res);
    }
}

async function deleteFormGuideById(req, res, next) {
    try {

        const id_form_guide = req.params.id_form_guide;

        const formguide = await FormsGuidesService.deleteFormGuide(id_form_guide);

        if (fs.existsSync(formguide.directory)) {
            fs.unlink(formguide.directory, (err) => {
                if (err) {
                    throw ({
                        message: 'el archivo no se elimina'
                    })
                }
            });
        }

        res.status(200).json({
            ok: true,
            formguide
            // message: `Llegamos a la eliminacion de un formulario o guia`,
            // data: formguide
        })
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
        message: 'error en el servicio de formularios y guias',
        error
    })
}

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
    getFormsGuidesByProcess,
    deleteFormGuideById,
}