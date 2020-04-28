const Process = require('../model/proceso.model');

function getProcesses() {
    return new Promise(async(resolve, reject) => {
        try {
            const listProcesses = await Process.find().populate([{ path: 'client', select: '-active -createdAt -updatedAt -__v' }, { path: 'visa_category', select: '-createdAt -updatedAt -__v' }]);

            resolve(listProcesses);

        } catch (error) {
            reject({
                status: 400,
                message: 'Error to create Process',
                errors: error
            });
        }
    });
}

function getProcessId(process) {
    return new Promise(async(resolve, reject) => {
        try {
            const process = await Process.findOne({ _id: process });

            resolve(process);

        } catch (error) {
            reject({
                status: 400,
                message: 'Error to find the Process',
                errors: error
            });
        }
    });
}

// crear nuevo VisaCategorye
function createProcess(newProcess) {
    return new Promise(async(resolve, reject) => {
        try {


            const listProcess = await Process.find({ active: true, client: newProcess.client, visa_category: newProcess.visa_category });

            if (listProcess.length > 0) {
                return reject({
                    status: 400,
                    message: 'Error, The client has process active',
                    errors: 'The client has process active'
                });
            }

            const process = new Process(newProcess);
            // console.log('verificacion al crear el proceso', process);
            await process.save();

            resolve(process);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to create Process',
                errors: error
            });
        }
    });
}

function editProcess(id, newProcess) {
    return new Promise(async(resolve, reject) => {
        try {
            const process = await Process.findById(id);

            if (!process) {
                return reject({
                    status: 400,
                    message: 'Error, Process doesn\'t exist',
                    errors: ''
                });
            }

            // if (newProcess.name) { process.name = newProcess.name; }

            if (newProcess.client) { process.client = newProcess.client; }
            if (newProcess.consultant) { process.consultant = newProcess.consultant; }
            if (newProcess.visa_category) { process.visa_category = newProcess.visa_category; }
            // if (newProcess.code) { process.code = newProcess.code; }
            // if (newProcess.status) { process.status = newProcess.status; }
            // if (newProcess.active) { process.active = newProcess.active; }

            // await process.save();

            resolve(process);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to edit Visa-Category',
                errors: error
            });
        }
    });
}

function disableProcess(id) {
    return new Promise(async(resolve, reject) => {
        try {
            const process = await Process.findByIdAndRemove(id);

            if (!process) {
                reject({
                    status: 400,
                    message: 'Error, the Process doesn\'t delete',
                    errors: error
                })
            }

            if (process.active) {
                process.active = false;
            }

            resolve(process);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error, the Process doesn\'t deletel',
                errors: error
            });
        }
    });
}

// function deleteProcess(id) {
//     return new Promise(async(resolve, reject) => {
//         try {
//             const process = await Process.findByIdAndRemove(id);

//             if (!process) {
//                 reject({
//                     status: 400,
//                     message: 'Error, the Process doesn\'t delete',
//                     errors: error
//                 })
//             }

//             resolve(process);
//         } catch (error) {
//             reject({
//                 status: 400,
//                 message: 'Error, the Process doesn\'t deletel',
//                 errors: error
//             });
//         }
//     });
// }

function getListByClientVisaCategory(client, visa) {
    return new Promise(async(resolve, reject) => {
        try {
            const process = Process.find({ client: client._id, visa_vategory: visa._id });
            await process.save();

            resolve(process);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to create Process',
                errors: error
            });
        }
    });
}

module.exports = {
    getProcesses,
    getProcessId,
    createProcess,
    editProcess,
    // deleteProcess,
    disableProcess,
}