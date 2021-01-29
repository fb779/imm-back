const UserModel = require('../model/user.model');
const authSer = require('../services/auth.services');
const _ = require('underscore');

async function validLoginUserEmail(_email, _password) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!_.isString(_email) || !_.isString(_password)) {
        throw {status: 400, message: 'Invalid credentials', errors: ''};
      }
      const user = await UserModel.findOne({email: _email, active: true});

      if (!user || !user.verifyPassword(_password)) {
        return reject({
          status: 400,
          ok: false,
          message: 'The credentials are incorrect, email or password has error',
          errors: ['The credentials are incorrect, email or password has error'],
        });
      }

      const token = await authSer.createToken(user);

      resolve(token);
    } catch (error) {
      if (error.status) {
        return reject(error);
      }

      return reject({
        status: 400,
        message: 'Error to login services',
        errors: error,
      });
    }
  });
}

module.exports = {
  validLoginUserEmail,
};
