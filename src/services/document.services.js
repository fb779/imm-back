/************************************************
 *  Importaciones
 ************************************************/
const Document = require('../model/document.model');
// const ClientService = require('./client.services');


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

function getDocumentsByClientId(id_client) {
    return new Promise(async(resolve, reject) => {
        try {

            const list_documents = await Document.find({ client: id_client }).select('-createdAt -updatedAt -__v');

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

// function editDocument(id_document, new_document) {
//     return new Promise(async(resolve, reject) => {
//         try {
//             const document = Document.findById(id_document);

//             document.name = new_document.name;
//             document.description = new_document.description;
//             document.type = new_document.type;

//             await document.save();

//             return resolve(document);
//         } catch (error) {
//             return reject({
//                 status: 500,
//                 message: 'Error to edit document',
//                 errors: error
//             });
//         }
//     });
// }

function deleteDocuments(documents) {
    return new Promise(async(resolve, reject) => {
        try {
            // const filter = documents.map(el => el.checklist.toString());
            const filter = documents.map(el => el._id);
            // const list_documents = await Document.deleteMany({ checklist: { $in: documents } });
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
    getDocumentsByClientId,
    createDocumentsByClient,
    // editDocument,
    deleteDocuments,
    deleteDocumentsByClient,
}