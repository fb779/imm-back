const User = require('../model/user.model');

function getUserById(id_user) {
  return new Promise(async(resolve, reject) => {
    try {
      const user = await User.findById(id_user).select('-password -createdAt -updatedAt -__v')

      if (!user) {
        return reject({
          status: 404,
          message: `The User isn't found`,
          errors: `The user doesn't find with this Id: ${id_user}`,
        });
      }

      resolve(user);
    } catch (error) {
      reject(error)
    }
  });

}

function getUserByEmail(_email) {
  return new Promise(async(resolve, reject) => {
    try {
      const user = await User.findOne({ email: _email })
      resolve(user);
    } catch (error) {
      reject(error)
    }
  });
}

function createUser(newUser) {
  return new Promise(async(resolve, reject) => {
    try {
      const user = new User(newUser);
      await user.save();
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

function generatePassword() {
  return new Promise(async(resolve, reject) => {
    try {
      const pass = Math.random().toString(36).slice(-8);
      return resolve(pass);
    } catch (error) {
      return reject(error)
    }
  });
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  generatePassword
}