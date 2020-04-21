const CheckList = require('../model/check-list.model');

function getListCheckList() {
    return new Promise(async(resolve, reject) => {
        try {
            const list = await CheckList.find().populate({ path: 'visa_categories' });

            return resolve(list);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to create VisaCategory',
                errors: error
            });
        }
    })
}

// function getCheckListById(id) {
//     return new Promise(async() => {
//         try {

//         } catch (error) {

//         }
//     })
// }


// crear nuevo VisaCategorye
function createCheckList(newCheckList) {
    return new Promise(async(resolve, reject) => {
        try {

            if (newCheckList.visa_categories) {
                newCheckList.visa_categories = await [...new Set(
                    newCheckList.visa_categories.split(',').filter(
                        el => (el.trim()) ? true : false
                    ).map(
                        el => el.trim()
                    )
                )];
            }

            console.log(newCheckList);

            const check = new CheckList(newCheckList);
            await check.save();

            resolve(check);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error to create Checklist',
                errors: error
            });
        }
    });
}

function editCheckList(id, newCheckList) {

    return new Promise(async(resolve, reject) => {
        try {
            const check = await CheckList.findById(id);

            if (!check) {
                reject({
                    status: 400,
                    message: 'Error, CheckList doesn\'t exist',
                    errors: ''
                });
            }

            if (newCheckList.visa_categories) {

                newCheckList.visa_categories = await [...new Set(
                    newCheckList.visa_categories.split(',').filter(
                        el => (el.trim()) ? true : false
                    ).map(
                        el => el.trim()
                    )
                )];

                check.visa_categories = newCheckList.visa_categories;
            }

            if (newCheckList.name) { check.name = newCheckList.name; }
            if (newCheckList.description) { check.description = newCheckList.description; }
            if (newCheckList.group) { check.group = newCheckList.group; }
            if (newCheckList.required) { check.required = newCheckList.required; }

            await check.save();

            resolve(check);

        } catch (error) {
            reject({
                status: 400,
                message: 'Error to edit Visa-Category',
                errors: error
            });
        }
    });
}


function deleteCheckList(id) {
    return new Promise(async(resolve, reject) => {
        try {
            const check = await CheckList.findByIdAndRemove(id);

            if (!check) {
                reject({
                    status: 400,
                    message: 'Error, the VisaCategory doesn\'t delete',
                    errors: error
                })
            }

            resolve(check);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error, the VisaCategory doesn\'t deletel',
                errors: error
            });
        }
    });
}

function disableCheckList(id) {
    return new Promise(async(resolve, reject) => {
        try {

            const check = await CheckList.findById(id);

            if (!check) {
                reject({
                    status: 400,
                    message: 'Error, CheckList doesn\'t exist',
                    errors: ''
                });
            }

            if (check.active) {
                check.active = false;
            }

            await check.save();

            resolve(check);
        } catch (error) {
            reject({
                status: 400,
                message: 'Error, the VisaCategory doesn\'t deletel',
                errors: error
            });
        }
    });
}

function enableCheckList(id) {
    return new Promise(async(resolve, reject) => {
        try {

            const check = await CheckList.findById(id);

            if (!check) {
                reject({
                    status: 400,
                    message: 'Error, CheckList doesn\'t exist',
                    errors: ''
                });
            }

            if (!check.active) {
                check.active = true;
            }

            await check.save();

            resolve(check);
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
    createCheckList,
    editCheckList,
    deleteCheckList,
    disableCheckList,
    enableCheckList,
}