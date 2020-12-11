const {seed, reset_seed} = require('../config/config');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const _ = require('underscore');

/**
 * metodo encargado de crear un token para las peticiones
 * Method to create a new access token
 **/
function createToken(user) {
  user = _.pick(user, ['role', 'client', '_id', 'first_name', 'last_name', 'email']);

  let dt = moment();

  const payload = {
    sub: user._id,
    user,
    iat: dt.unix(),
    exp: dt.add(2, 'days').unix(),
  };

  return jwt.sign(payload, seed);
}

/**
 * metodo encargado de validar (verificacion de firma y fecha) y decodificar el token
 *    en caso contrario genera un error
 * Method to verify and validate the access token (signature and expiration date)
 **/
function decodeToken(token) {
  const decode = new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, seed);

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Token expirado',
        });
      }

      resolve(payload);
    } catch (error) {
      reject({
        status: 500,
        message: 'Invalid token',
      });
    }
  });

  return decode;
}

/**
 * metodo encargado de crear un token para las peticiones de reestablecimiento de password
 * Method to create a new access token to reset-password
 **/
function createResetToken(user) {
  user = _.pick(user, ['email', 'role']);

  let dt = moment();

  const payload = {
    sub: user.email,
    user,
    iat: dt.unix(),
    exp: dt.add(2, 'hours').unix(),
  };

  return jwt.sign(payload, reset_seed);
}

/**
 * metodo encargado de validar (verificacion de firma y fecha) y decodificar el token del restablecimiento de password
 *    en caso contrario genera un error
 * Method to verify and validate the access token to reset-password (signature and expiration date)
 **/
function decodeResetToken(token) {
  const decode = new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, reset_seed);

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Token expirado',
        });
      }

      resolve(payload);
    } catch (error) {
      reject({
        status: 500,
        message: 'Invalid token',
      });
    }
  });

  return decode;
}
module.exports = {
  createResetToken,
  decodeResetToken,
  createToken,
  decodeToken,
};
