const VisaCategory = require('../model/visa-category.model');

// obtener un tipo de visa por su nombre
function getByName(name) {
    return new Promise(async(resolve, reject) => {
        try {

            const visa = await VisaCategory.findOne({ active: true, name: { $eq: name.toUpperCase() } }).select('-createdAt -updatedAt -__v');

            if (!visa) {
                reject({
                    status: 400,
                    message: `The Visa Category "${ name.toUpperCase() }" does't exist with this name`,
                    errors: 'This Visa Category does\'t exist'
                });
            }

            resolve(visa);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to find VisaCategory',
                errors: error
            });
        }
    });
}

// crear nuevo VisaCategorye
function createVisaCategory(newVisaCategory) {
    return new Promise(async(resolve, reject) => {
        try {
            const visa = new VisaCategory(newVisaCategory);
            await visa.save();

            resolve(visa);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to create VisaCategory',
                errors: error
            });
        }
    });
}

function editVisaCategory(id, newVisa) {
    return new Promise(async(resolve, reject) => {
        try {
            const visa = await VisaCategory.findById(id);

            if (!visa) {
                reject({
                    status: 400,
                    message: 'Error, VisaCategory doesn\'t exist',
                    errors: ''
                });
            }

            if (newVisa.name) { visa.name = newVisa.name; }
            if (newVisa.description) { visa.description = newVisa.description; }
            if (newVisa.active) { visa.active = newVisa.active; }

            await visa.save();

            resolve(visa);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to edit Visa-Category',
                errors: error
            });
        }
    });
}


function deleteVisaCategory(id) {
    return new Promise(async(resolve, reject) => {
        try {
            const visa = await VisaCategory.findByIdAndRemove(id);

            if (!visa) {
                reject({
                    status: 400,
                    message: 'Error, the VisaCategory doesn\'t delete',
                    errors: error
                })
            }

            resolve(visa);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error, the VisaCategory doesn\'t deletel',
                errors: error
            });
        }
    });
}


module.exports = {
    createVisaCategory,
    editVisaCategory,
    deleteVisaCategory,
    getByName,
}