const User = require('../model/user.model');
const MailServices = require('../services/nodemailer');
const {passwordRegex} = require('../config/config');
const _ = require('underscore');
const fields_out = '-createdAt -updatedAt -__v';

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
      const user = await User.findOne({email: _email});
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

      if (user) {
        const mailOptions = {
          to: user.email,
          data: {
            user: newUser.email,
            password: newUser.password,
          },
        };
        await MailServices.sendMail(MailServices.templates.newuser, mailOptions);
      }

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

function updateUser(id, userUpdate) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id).select(fields_out).populate('client');

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

      if (userUpdate.bio) {
        user.bio = userUpdate.bio;
      }

      // user.img = userUpdate.img || user.img;

      user.active = userUpdate.active || user.active;

      await user.save();

      return resolve(user);
    } catch (error) {
      return reject(error);
    }
  });
}

function updatePhoto(id, photoPath) {
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

      user.img = photoPath;

      await user.save();

      // const user = await User.findByIdAndUpdate(id, {img: photoPath}, {new: true, runValidators: true});

      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

function updatePassword(id, oldPassword, newPassword) {
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

      if (!user.verifyPassword(oldPassword)) {
        return reject({
          status: 400,
          ok: false,
          message: `Old password isn't correct`,
        });
      }

      user.password = newPassword;

      await user.save();

      // const user = await User.findByIdAndUpdate(id, {password: newPassword}, {new: true, runValidators: true});

      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

function resetPassword(email, newPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOneAndUpdate({email}, {password: newPassword}, {new: true, runValidators: true}).select(fields_out);

      return resolve(user);
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

function validSafePassword(password, confirmPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      if (password !== confirmPassword) {
        return reject({
          status: 400,
          ok: false,
          message: `The password and confir-password are diferents`,
        });
      }

      const valid = passwordRegex.test(password);
      if (!valid) {
        return reject({
          status: 400,
          ok: false,
          message: `The password isn't strong, password need 1-8 characters, minimun 1 CapitalLetter, 1 LowerLetter and 1 numbers`,
        });
      }

      return resolve(true);
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
  // getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updatePhoto,
  updatePassword,
  resetPassword,
  generatePassword,
  validEmail,
  validSafePassword,
};
