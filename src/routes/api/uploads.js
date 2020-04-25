const express = require('express');

const fileUpload = require('express-fileupload');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/processes/');

// Inicialización
const router = express.Router();


// router.get('/:nombre?', (req, res, next) => {
//     var nombre = req.params.nombre || '';
//         // console.log(nombre);
//     return res.status(200).json({
//         ok: true,
//         mensaje: `Petición exitosa immigrative, hola ${nombre}...`
//     });
// });

// default options
router.use(fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 4
}));

// router.post('/', (req, res, next) => {
router.post('/:id_process/:id_client', async(req, res, next) => {
    const process = req.params.id_process || '';
    const client = req.params.id_client || '';
    const body = req.body || '';

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mesaje: 'No selecciono nada',
            errors: {
                message: 'Debe seleccionar una imagen'
            }
        });
    }

    // console.log(req.files);

    const files_upload = Object.keys(req.files).map((file) => loadFileServer(req.files[file], file, process, client));

    var fsup = [];

    await Promise.all(
        files_upload
    ).then(x => {
        fsup = x;
    });

    return res.status(200).json({
        ok: true,
        mensaje: `llegaron los archivos al upload`,
        process,
        client,
        body,
        fsup,
    });
});

async function loadFileServer(file, keyFile, process, client) {
    var archivo = file;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    // definicion del nombre del archivo
    var nombreArchivo = `${ keyFile }.${ moment().unix() }.${ extension }`;

    // definicion de la rua de guardado
    var file_path = `${uploadDir}/${ process }/${ client }/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(file_path)

    return ({
        original_name: file.name,
        name: nombreArchivo,
        mimetype: file.mimetype,
        size: file.size
    });

    // });

}



// router.get('/:nombre?', metodo);

// metodo = (req, res, next) => {
//     res.status(200).json({});
// }

module.exports = router;