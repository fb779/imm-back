const Family = require('../model/family.model');
const Client = require('../model/client.model');
const ClientService = require('../services/client.services');
const DocumentService = require('./document.services');

function getFamilyByProcess(process) {
    return new Promise(async(resolve, reject) => {
        try {
            const familyList = await Family.find({ process: process }).select('-_id -process -createdAt -updatedAt -__v').populate([{ path: 'client', select: '-email -createdAt -updatedAt -__v -active' }]);

            resolve(familyList);
        } catch (error) {
            reject({
                status: 500,
                message: 'Error, the client doesn\'t find',
                errors: error
            });
        }
    })
}

function createFamilyMember(process, client) {
    return new Promise(async(resolve, reject) => {
        try {
            // console.log(process, client);
            // const newClient = new Client(client);
            // await newClient.save();
            const newClient = await ClientService.createClient(client);

            const family = new Family({ client: newClient, process: process });
            await family.save();

            resolve(family);
            // resolve({ ok: true });
        } catch (error) {
            // console.log('eliminar el cliente', newClient);
            await Client.findByIdAndRemove(newClient._id);
            reject({
                status: 500,
                message: 'Error al crear familiar',
                errors: error
            });
        }
    })
}

function editFamilyMember(editClient) {
    return new Promise(async(resolve, reject) => {
        try {
            const client = await await Client.findById(editClient._id).select('-email -createdAt -updatedAt -active -__v');

            if (!client) {
                return reject({
                    ok: false,
                    message: `Client doesn't exist`,
                    error: {}
                });
            }

            if (editClient.first_name) { client.first_name = editClient.first_name; }
            if (editClient.last_name) { client.last_name = editClient.last_name; }
            if (editClient.title) { client.title = editClient.title; }
            if (editClient.sex) { client.sex = editClient.sex; }
            // if (editClient.birthday) { client.birthday = editClient.birthday; }
            if (editClient.age) { client.age = editClient.age; }
            if (editClient.country_citizenship) { client.country_citizenship = editClient.country_citizenship; }
            client.other_citizenship = editClient.other_citizenship;
            if (editClient.country_residence) { client.country_residence = editClient.country_residence; }
            if (editClient.status_residence) { client.status_residence = editClient.status_residence; }
            if (editClient.status_residence_other) { client.status_residence_other = editClient.status_residence_other; }

            await client.save();

            resolve(client);
        } catch (error) {
            reject({
                status: 500,
                message: 'Error al editar familiar',
                errors: error
            })
        }
    })
}

function deleteFamilyMember(id_process, id_client) {
    return new Promise(async(resolve, reject) => {
        try {
            const member = await Family.findOneAndRemove({ process: id_process, client: id_client });

            if (!member) {
                reject({
                    status: 404,
                    message: 'Error al eliminar un miembro de la familia, no existe el proceso ',
                    errors: {}
                })
            }

            const client = await Client.findByIdAndRemove(id_client);

            await DocumentService.deleteDocumentsByClient(client);

            return resolve(member);
        } catch (error) {
            reject({
                status: 500,
                message: 'Error al eliminar un miembro de la familia',
                errors: error
            });
        }
    })
}

module.exports = {
    getFamilyByProcess,
    createFamilyMember,
    editFamilyMember,
    deleteFamilyMember,
}