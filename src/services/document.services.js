/************************************************
 *  Importaciones
 ************************************************/
const Document = require('../model/document.model');
// const ClientService = require('./client.services');


/************************************************
 *  Deficnicion de metodos
 ************************************************/

function getDocumentsByClientId(id_client) {
    return new Promise(async(resolve, reject) => {
        try {

            const list_documents = await Document.find({ client: id_client });
            return resolve(list_documents);
            // resolve(list_documents);

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

function deleteDocuments(documents) {
    return new Promise(async(resolve, reject) => {
        try {
            const filter = documents.map(el => el.checklist.toString());
            // const list_documents = await Document.deleteMany({ checklist: { $in: documents } });
            const list_documents = await Document.deleteMany({ checklist: { $in: filter } });
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
    getDocumentsByClientId,
    createDocumentsByClient,
    deleteDocuments,
}