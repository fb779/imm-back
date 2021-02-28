/************************************************
 *  Importaciones
 ************************************************/
const path = require('path');
const fs = require('fs');
const {uploadDir, uploadDirPhoto, typeFilesUpload, typesStatusDocument} = require('./../config/config');

const UserService = require('../services/user.services');
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
        message: 'Error, no esta dentro de las opciones permitidas',
      });
    }

    const process = await ProcessService.getProcessId(id_process);

    if (!req.files || req.files.length > 0) {
      return res.status(404).json({
        ok: false,
        message: 'Error, You need select a document',
      });
    }

    const files_upload = req.files[Object.keys(req.files)[0]];

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
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function uploadDocuments(req, res, next) {
  try {
    const id_document = req.params.id_document;

    if (!req.files || req.files.length > 0) {
      return res.status(404).json({
        ok: false,
        message: 'Error, You need select a document',
      });
    }

    const document = await DocumentServices.getDocumentById(id_document);

    const process = await ProcessService.getProcessId(document.process);
    const client = await ClientService.getById(document.client);

    const files_upload = req.files[Object.keys(req.files)[0]];

    // const rt = loadSingleFilesServer(files_upload, nameFile(files_upload, typeFilesUpload.documents, process._id, client._id, document.name));
    const rt = loadSingleFilesServer(files_upload, nameFile(files_upload, typeFilesUpload.documents, null, client._id, document.name));

    document.status = typesStatusDocument.uploaded;
    document.file_name = rt.name;
    document.extension = rt.extension;
    document.directory = rt.directory;

    await document.save();

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id;

    if (!req.files || req.files.length > 0) {
      throw {
        status: 404,
        ok: false,
        message: 'Error, You need select a document',
      };
    }

    const archivo = req.files[Object.keys(req.files)[0]];
    const [name, ext] = archivo.name.split('.');

    const userUpdate = await UserService.getUserById(id);

    let file_name = `${uploadDirPhoto}/${userUpdate._id}-${new Date().getMilliseconds()}.${ext}`;

    const rt = loadSingleFilesServer(archivo, file_name);

    removeOldPhoto(userUpdate.img);

    userUpdate.img = rt.name;

    await userUpdate.save();

    // userUpdate.img = userUpdate.img64;

    return res.status(200).json({
      ok: true,
      data: userUpdate,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

/************************************************
 *  Metodo de trabajo para la carga de archivos
 ************************************************/

// const nameFile = (file, type_document, id_client, keyFile) => {
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
      throw {message: `Error, the client is required`};
    }
    params.push(id_client);
  }

  // definicion del nombre del archivo
  var nombreArchivo = '';

  if (type_document === typeFilesUpload.documents && keyFile) {
    // nombreArchivo = `${ keyFile.replace(/\s/gi, '-') }.${ moment().unix() }.${ extension }`;
    nombreArchivo = `${keyFile.replace(/[&\/\\#,+()$~%.'":*?<>{}]/gi, '').replace(/\s/gi, '-')}.${extension}`;
  } else {
    nombreArchivo = `${nombreCortado[0].replace(/[&\/\\#,+()$~%.'":*?<>{}]/gi, '').replace(/\s/gi, '-')}.${extension}`;
  }

  // definicion de la rua de guardado
  var file_path = path.join(uploadDir, params.join('/'), nombreArchivo);

  return file_path;
};

function loadSingleFilesServer(file, file_path, res) {
  try {
    const name = file_path.split('/').pop();
    const extension = file_path.split('.').pop();

    // Use the mv() method to place the file somewhere on your server
    file.mv(file_path);

    return {
      original_name: file.name,
      name,
      extension,
      directory: file_path,
      mimetype: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    errorHandler(error, res);
  }
}

function removeOldPhoto(photoPath) {
  var pathOld = `${uploadDirPhoto}/${photoPath}`;
  if (photoPath && fs.existsSync(pathOld)) {
    fs.unlinkSync(pathOld);
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
      error: error.errors,
    });
  }
  return res.status(500).json({
    ok: false,
    message: 'Error, upload files',
    error,
  });
};

/************************************************
 *  Expor metodos
 ************************************************/

module.exports = {
  uploadFormsGuides,
  uploadDocuments,
  uploadPhoto,
};
