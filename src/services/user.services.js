const User = require('../model/user.model');
const clientService = require('../services/client.services');
const campos = '_id first_name last_name email role active client img';
const fields_out = '-password -createdAt -updatedAt -__v';

function getUsers(offset, limit) {
  return new Promise(async (resolve, reject) => {
    try {
      var offset = req.query.offset || 0;
      offset = Number(offset);
      var limit = req.query.limit || 20;

      const users = await User.find({}).select('-img -active -createdAt -updatedAt -__v');
      // .skip(offset)
      // .limit(limit)
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
}

function getUserById(id_user) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id_user).select('-password -createdAt -updatedAt -__v');

      if (!user) {
        return reject({
          status: 404,
          message: `The User isn't found`,
          errors: `The user doesn't find with this Id: ${id_user}`,
        });
      }

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

function getUserByEmail(_email) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: _email });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

function createUser(newUser) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = new User(newUser);
      await user.save();
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

function updateUser(id, userUpdate) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id).select(fields_out);

      if (!user) {
        throw {
          status: 400,
          message: "Error, user doesn't exist",
          errors: '',
        };
      }

      if (userUpdate.email && userUpdate.email !== user.email) {
        user.email = userUpdate.email;
      }

      if (userUpdate.first_name) {
        user.first_name = userUpdate.first_name;
      }

      if (userUpdate.last_name) {
        user.last_name = userUpdate.last_name;
      }

      if (userUpdate.role) {
        user.role = userUpdate.role;
      }

      if (userUpdate.password) {
        user.password = userUpdate.password;
      }

      user.active = userUpdate.active;

      // if (userUpdate.client) {
      //   user.client = userUpdate.client;
      // }

      await user.save();

      return resolve(user);
    } catch (error) {
      return reject(error);
    }
  });
}

function updatePassword(id, newPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

function validEmail(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.countDocuments(filter);
      if (users > 0) {
        return resolve(true);
      }

      return resolve(false);
    } catch (error) {
      return reject(error);
    }
  });
}

function generatePassword() {
  return new Promise(async (resolve, reject) => {
    try {
      const pass = Math.random().toString(36).slice(-8);
      return resolve(pass);
    } catch (error) {
      return reject(error);
    }
  });
}

/**
 * Filtros
 */
function makeFilters(filters) {}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  generatePassword,
  updatePassword,
  validEmail,
};
