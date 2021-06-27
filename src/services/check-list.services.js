const CheckList = require('../model/check-list.model');
const _ = require('underscore');

function getCheckListByName(_name) {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await CheckList.find({name: _name});

      return resolve(list);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error to create checklist',
        errors: error,
      });
    }
  });
}

function getListCheckList(filter = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await CheckList.find(filter);

      return resolve(list);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error to create checklist',
        errors: error,
      });
    }
  });
}

function getCheckListById(id_checklist) {
  return new Promise(async (resolve, reject) => {
    try {
      const checklist = await CheckList.findById(id_checklist).populate([{path: 'client'}]);

      if (!checklist) {
        return reject({
          status: 404,
          message: `The CheckList isn't found`,
          errors: `The CheckList doesn't find with this Id: ${id_checklist}`,
        });
      }

      return resolve(checklist);
    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to find items checklist',
        errors: error,
      });
    }
  });
}

function getCheckListByIds(ids) {
  return new Promise(async (resolve, reject) => {
    try {
      const list_ids = [
        ...new Set(
          ids
            .split(',')
            .filter((el) => (el.trim() ? true : false))
            .map((el) => el.trim())
        ),
      ];

      const list_items = await CheckList.find({_id: {$in: list_ids}}).select('_id name');

      if (list_items.length !== list_ids.length) {
        return reject({
          status: 404,
          message: 'Error to find all items checklist',
          errors: error,
        });
      }

      return resolve(list_items);
    } catch (error) {
      return reject({
        status: 500,
        message: 'Error to find items checklist',
        errors: error,
      });
    }
  });
}

// crear nuevo VisaCategorye
function createCheckList(newCheckList) {
  return new Promise(async (resolve, reject) => {
    try {
      if (newCheckList.visa_categories) {
        newCheckList.visa_categories = await [...new Set(newCheckList.visa_categories.filter((el) => (el.trim() ? true : false)).map((el) => el.trim()))];
      }

      const nCheckList = _.pick(newCheckList, ['name', 'group', 'state', 'visa_categories', 'description']);

      // const check = new CheckList.create(newCheckList);
      // await check.save();

      const check = await CheckList.create(nCheckList);

      resolve(check);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create Checklist',
        errors: error,
      });
    }
  });
}

function editCheckList(id, editCheckList) {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await CheckList.findByIdAndUpdate(id, editCheckList, {new: true, runValidators: true, context: 'query'});

      resolve(check);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit CheckList',
        errors: error,
      });
    }
  });
}

function deleteCheckList(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await CheckList.findByIdAndRemove(id);

      if (!check) {
        reject({
          status: 400,
          message: "Error, the CheckList doesn't delete",
          errors: error,
        });
      }

      resolve(check);
    } catch (error) {
      reject({
        status: 400,
        message: "Error, the CheckList doesn't deletel",
        errors: error,
      });
    }
  });
}

function disableCheckList(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await CheckList.findById(id);

      if (!check) {
        reject({
          status: 400,
          message: "Error, CheckList doesn't exist",
          errors: '',
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
        message: "Error, the CheckList doesn't deletel",
        errors: error,
      });
    }
  });
}

function enableCheckList(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await CheckList.findById(id);

      if (!check) {
        reject({
          status: 400,
          message: "Error, CheckList doesn't exist",
          errors: '',
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
        message: "Error, the CheckList doesn't deletel",
        errors: error,
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
  getCheckListById,
  getCheckListByIds,
  getCheckListByName,
  getListCheckList,
};
