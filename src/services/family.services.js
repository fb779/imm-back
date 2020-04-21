const Family = require('../model/family.model');
const Client = require('../model/client.model');

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
        const newClient = new Client(client);
        try {
            // console.log(process, client);
            await newClient.save();

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

// function editFamilyMember() {
//     return new Promise(async(resolve, reject) => {
//         try {

//         } catch (error) {

//         }
//     })
// }

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

            await Client.findByIdAndRemove(id_client);

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
    // editFamilyMember,
    deleteFamilyMember,
}