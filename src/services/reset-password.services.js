const UserReset = require('../model/user-reset.model');
const authSer = require('./auth.services');
const moment = require('moment');
const _ = require('underscore');

function validExistResetRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await UserReset.find({email});

      // resolve(data);
      resolve(data.some((el) => el.status));
    } catch (error) {
      reject(error);
    }
  });
}

function createRequesPassword(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const {email} = _.pick(user, ['email']);

      const token = authSer.createResetToken(user);

      const newData = {
        email,
        token,
        expire: moment().add(2, 'hours').unix(),
      };

      // const newReset = new UserReset(dataReset);
      // await newReset.save();

      const data = await UserReset.create(newData);

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  validExistResetRequest,
  createRequesPassword,
};
