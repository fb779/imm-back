const User = require('../model/user.model');

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
  getUserByEmail,
  createUser,
  generatePassword
}