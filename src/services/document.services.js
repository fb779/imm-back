/************************************************
 *  Importaciones
 ************************************************/
const Document = require('../model/document.model');
const { typesDocument } = require('../config/config');


/************************************************
 *  Deficnicion de metodos
 ************************************************/

function getDocumentById(id_document) {
  return new Promise(async(resolve, reject) => {
    try {

      const document = await Document.findById(id_document);

      if (!document) {
        return reject({
          status: 404,
          message: `The Document isn't found`,
          errors: `The Document doesn't find with this Id: ${id_document}`,
        });
      }

      return resolve(document);

    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to find list documents by client',
        errors: error
      });
    }
  });
}

function getDocuments(type, id) {
  return new Promise(async(resolve, reject) => {
    try {
      var filter = {};

      switch (type) {
        case typesDocument.client:
        case typesDocument.process:
          filter[type] = id;
          break;

        default:
          reject({
            status: 400,
            message: `Error, the type isn't exist`,
            errors: {}
          });
          break;
      }

      const list_documents = await Document.find(filter).select('-createdAt -updatedAt -__v');

      return resolve(list_documents);

    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to find list documents by client',
        errors: error
      });
    }
  });
}

function getDocumentsByClientId(id_client) {
  return new Promise(async(resolve, reject) => {
    try {
      const list_documents = await Document.find({ client: id_client }).select('-createdAt -updatedAt -__v').sort('process checklist');

      return resolve(list_documents);

    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to find list documents by client',
        errors: error
      });
    }
  });
}

function getDocumentsByProcessClient(id_process, id_client) {
  return new Promise(async(resolve, reject) => {
    try {
      const list_documents = await Document.find({ process: id_process, client: id_client }).select('-createdAt -updatedAt -__v').sort('checklist');

      return resolve(list_documents);

    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to find list documents by client',
        errors: error
      });
    }
  });
}

function createDocumentsByClient(itemsChecklist) {
  return new Promise(async(resolve, reject) => {
    try {
      const documents = await Document.insertMany(itemsChecklist);
      return resolve(documents);
    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to create checklist',
        errors: error
      });
    }
  });
}

function uploadDocument(id_document, new_document) {
  return new Promise(async(resolve, reject) => {
    try {
      const document = Document.findById(id_document);

      document.description = new_document.description;
      document.status = new_document.status;
      document.extension = new_document.extension;

      await document.save();

      return resolve(document);
    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to edit document',
        errors: error
      });
    }
  });
}

function deleteDocuments(documents) {
  return new Promise(async(resolve, reject) => {
    try {
      const filter = documents.map(el => el._id);
      const list_documents = await Document.deleteMany({ _id: { $in: filter } });
      return resolve(list_documents);
    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to delete documents',
        errors: error
      });
    }
  });
}

function deleteDocumentsByClient(client) {
  return new Promise(async(resolve, reject) => {
    try {
      const list_documents = await Document.deleteMany({ client: client._id });
      return resolve(list_documents);

    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to delete documents',
        errors: error
      });
    }
  });
}

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
  getDocumentById,
  getDocuments,
  getDocumentsByClientId,
  getDocumentsByProcessClient,
  createDocumentsByClient,
  uploadDocument,
  deleteDocuments,
  deleteDocumentsByClient,
}