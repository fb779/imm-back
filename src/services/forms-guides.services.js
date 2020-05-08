/************************************************
 *  Importaciones
 ************************************************/
const FormsGuides = require('../model/forms-guides.mode');

/************************************************
 *  Deficnicion de metodos
 ************************************************/
function getformGuideById(id_form_guide) {
    return new Promise(async(resolve, reject) => {
        try {
            const form_guide = await FormsGuides.findById(id_form_guide).select('-directory -createdAt -updatedAt -__v');

            if (!form_guide) {
                // throw ({
                //     status: 404,
                //     message: `Error, The Document isn't exist`,
                //     error: {
                //         message: `Error, The Document isn't exist with this Id: ${id_form_guide}`
                //     }
                // })

                return reject({
                    status: 404,
                    message: `Error, The Document isn't exist`,
                    errors: `Error, The Document isn't exist with this Id: ${id_form_guide}`
                });
            }

            return resolve(form_guide);
        } catch (error) {
            return reject({
                status: 500,
                message: 'Error to find forms or guides',
                errors: error
            });
        }
    });
}

function getformsGuidesByProcess(id_process, type_document) {
    return new Promise(async(resolve, reject) => {
        try {
            const listItems = FormsGuides.find({ process: id_process, type: type_document }).select('-directory -createdAt -updatedAt -__v');

            return resolve(listItems);
        } catch (error) {
            return reject({
                status: 500,
                message: 'Error to find forms or guides',
                errors: error
            });
        }
    });
}

function getformsGuidesByProcesses(processes, type_document) {
    return new Promise(async(resolve, reject) => {
        try {
            var filter = { process: { $in: processes } };

            if (type_document) {
                filter['type'] = type_document;
            }

            const listItems = await FormsGuides.find(filter).select('-directory -createdAt -updatedAt -__v');

            return resolve(listItems);
            // return resolve(true);
        } catch (error) {
            return reject({
                status: 500,
                message: 'Error to find forms or guides',
                errors: error
            });
        }
    });
}

function createFormGudide(newFormGuide) {
    return new Promise(async(resolve, reject) => {
        try {
            const form_guide = new FormsGuides(newFormGuide);

            await form_guide.save();

            return resolve(form_guide);
        } catch (error) {
            return reject({
                status: 500,
                message: 'Error to create form or guide',
                errors: error
            });
        }
    });
}

// function editFormGuide(id_document, new_document) {
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

function deleteFormGuide(id_form_guide) {
    return new Promise(async(resolve, reject) => {
        try {
            const form_guide = await FormsGuides.findOneAndRemove({ _id: id_form_guide });

            if (!form_guide) {
                return reject({
                    status: 404,
                    message: `Error, item doesn't exist`,
                    errors: { message: `Error, item doesn't exist with this Id: ${id_form_guide}` }
                });
                // throw ({ status: 404, message: 'No se encontro ningun dato' });
            }

            return resolve(form_guide);
        } catch (error) {
            return reject({
                status: 500,
                message: 'Error to create form or guide',
                errors: error
            });
            // return reject(error);
        }
    });
}

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
    getformGuideById,
    getformsGuidesByProcess,
    getformsGuidesByProcesses,
    createFormGudide,
    deleteFormGuide,
}