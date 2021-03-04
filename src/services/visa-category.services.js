const VisaCategory = require('../model/visa-category.model');
const {visaCategories} = require('../config/config');

// obtener un tipo de visa por su nombre
function getVCList() {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await VisaCategory.find().select('-createdAt -updatedAt -__v');

      resolve(list);
    } catch (error) {
      reject({status: 500, message: 'Error to load list VisaCategory', errors: error});
    }
  });
}

// obtener un tipo de visa por su nombre
function getByName(name) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = await VisaCategory.findOne({name: {$eq: name.toUpperCase()}}).select('-createdAt -updatedAt -__v');

      if (!visa) {
        reject({status: 400, message: `The Visa Category "${name.toUpperCase()}" does't exist with this name`, errors: "This Visa Category does't exist"});
      }

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: 'Error to find VisaCategory', errors: error});
    }
  });
}

function getByTitle(title) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = await VisaCategory.findByTitle(title).select('-createdAt -updatedAt -__v');

      // if (!visa) {
      //   reject({status: 400, message: `The Visa Category "${title.toUpperCase()}" does't exist with this name`, errors: "This Visa Category does't exist"});
      // }

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: 'Error to find VisaCategory', errors: error});
    }
  });
}

function getByProduct(product) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = await VisaCategory.findByProduct(product).select('-createdAt -updatedAt -__v');

      if (!visa) {
        reject({
          status: 400,
          message: `The Visa Category "${product}" does't exist`,
          errors: "This Visa Category does't exist",
        });
      }

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: 'Error to find VisaCategory', errors: error});
    }
  });
}

function getById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = await VisaCategory.findById(id).select('-createdAt -updatedAt -__v');

      // if (!visa) {
      //   reject({status: 400, message: `The Visa Category "${title.toUpperCase()}" does't exist with this name`, errors: "This Visa Category does't exist"});
      // }

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: 'Error to find VisaCategory', errors: error});
    }
  });
}

// crear nuevo VisaCategorye
function createVisaCategory(newVisaCategory) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = new VisaCategory(newVisaCategory);

      await visa.save();

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: 'Error to create VisaCategory', errors: error});
    }
  });
}

function editVisaCategory(id, dataVisa) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = await VisaCategory.findByIdAndUpdate(id, dataVisa, {new: true, runValidators: false, context: 'query'});

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: 'Error to edit Visa-Category', errors: error});
    }
  });
}

function deleteVisaCategory(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const visa = await VisaCategory.findByIdAndRemove(id);

      if (!visa) {
        reject({status: 400, message: "Error, the VisaCategory doesn't delete", errors: error});
      }

      resolve(visa);
    } catch (error) {
      reject({status: 400, message: "Error, the VisaCategory doesn't deletel", errors: error});
    }
  });
}

module.exports = {
  createVisaCategory,
  editVisaCategory,
  deleteVisaCategory,
  getById,
  getByName,
  getByTitle,
  getByProduct,
  getVCList,
};
