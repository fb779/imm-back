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

async function uploadFormsGuides(req, res, next) {
    try {
        var description = req.body.description || '';
        const type_document = req.body.type_document.toLowerCase() || null;
        const id_process = req.params.id_process;

        if (!type_document || !Object.values(typeFilesUpload).includes(type_document)) {
            return res.status(404).json({
                ok: false,
                message: 'Error, no esta dentro de las opciones permitidas'
            })
        }

        const process = await ProcessService.getProcessId(id_process);

        const files_upload = req.files[Object.keys(req.files)[0]]

        const rt = loadSingleFilesServer(files_upload, nameFile(files_upload, type_document, process._id, null, null));

        var data = {
            process: process._id,
            name: rt.name,
            description,
            type: type_document,
            directory: rt.directory,
        };

        const forms_guides = await FormsGuidesService.createFormGudide(data);

        return res.status(200).json({
            ok: true,
            // data: forms_guides,

        })
    } catch (error) {
        errorHandler(error, res);
    }
}

async function uploadDocuments(req, res, next) {
    try {
        var description = req.body.description || '';
        const type_document = req.body.type_document.toLowerCase() || null;
        const id_process = req.params.id_process;
        const id_document = req.params.id_document;

        const process = await ProcessService.getProcessId(id_process);
        const document = await DocumentServices.getDocumentById(id_document);
        const client = await ClientService.getById(document.client);
        const id_client = client._id;

        return res.status(200).json({
            ok: true,
            message: `Llegamos a cargar documentos`
        });
    } catch (error) {
        errorHandler(error, res);
    }
};

/************************************************
 *  Metodo de trabajo para la carga de archivos
 ************************************************/

const nameFile = (file, type_document, id_process, id_client, keyFile) => {
    var nombreCortado = file.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];
    var params = [];

    if (id_process) {
        params.push(id_process);
    }

    if (type_document && type_document !== typeFilesUpload.documents) {
        params.push(type_document);
    }

    if (type_document && type_document === typeFilesUpload.documents) {
        if (!id_client) {
            throw ({ message: `Error, the client is required` })
        }
        params.push(id_client);
    }

    // definicion del nombre del archivo
    var nombreArchivo = '';

    if (type_document === typeFilesUpload.documents && keyFile) {
        // nombreArchivo = `${ keyFile.replace(/\s/gi, '-') }.${ moment().unix() }.${ extension }`;
        nombreArchivo = `${ keyFile.replace(/\s/gi, '-') }.${ extension }`;
    } else {
        nombreArchivo = `${ nombreCortado[0].replace(/\s/gi, '-') }.${ extension }`;
    }

    // definicion de la rua de guardado
    var file_path = path.join(uploadDir, params.join('/'), nombreArchivo)

    return file_path;
}


function loadSingleFilesServer(file, file_path, res) {
    // Use the mv() method to place the file somewhere on your server
    const name = file_path.split('/').pop();
    const extension = file_path.split('.').pop();

    file.mv(file_path);

    return {
        original_name: file.name,
        name,
        extension,
        directory: file_path,
        mimetype: file.mimetype,
        size: file.size
    };
}


// async function cargaArchivos(req, res, next) {
//     const process = req.params.id_process || '';
//     const client = req.params.id_client || '';
//     const body = req.body || '';
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).json({
//             ok: false,
//             mesaje: 'No selecciono nada',
//             errors: {
//                 message: 'Debe seleccionar un archivo'
//             }
//         });
//     }
//     // console.log(req.files);
//     const files_upload = Object.keys(req.files).map((file) => loadFileServer(req.files[file], file, process, client));
//     var fsup = [];
//     await Promise.all(
//         files_upload
//     ).then(x => {
//         fsup = x;
//     });
//     return res.status(200).json({
//         ok: true,
//         mensaje: `llegaron los archivos al upload`,
//         process,
//         client,
//         body,
//         fsup,
//     });
// }

// function loadFileServer(file, keyFile, process, client) {
//     var archivo = file;
//     var nombreCortado = archivo.name.split('.');
//     var extension = nombreCortado[nombreCortado.length - 1];

//     // definicion del nombre del archivo
//     var nombreArchivo = `${ keyFile.replace(/\s/gi, '-') }.${ moment().unix() }.${ extension }`;

//     // definicion de la rua de guardado
//     var file_path = `${uploadDir}/${ process }/${ client }/${nombreArchivo}`;

//     // Use the mv() method to place the file somewhere on your server
//     archivo.mv(file_path)

//     return ({
//         original_name: file.name,
//         name: nombreArchivo,
//         mimetype: file.mimetype,
//         size: file.size
//     });
// }

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
        ok: false,
        message: 'error en el servicio de upload files',
        error
    })
}

/************************************************
 *  Expor metodos
 ************************************************/

module.exports = {
    uploadFormsGuides,
    uploadDocuments
}