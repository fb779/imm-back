const seed = require('../config/config').seed;
const jwt = require('jsonwebtoken');
const moment = require('moment');

// metodo encargado de crear un token para las peticiones de wix
function createWixToken(user) {
  user.password = ':)';
  user.img = ':)';

  let dt = moment();

  const payload = {
    sub: user._id,
    user,
    iat: dt.valueOf(),
    exp: dt.add(20, 'minutes').valueOf(),
  };

  return jwt.sign(payload, seed);
}

// metodo encargado de validar (verificacion de firma y fecha) y decodificar el token
// en caso contrario genera un error
function decodeToken(token) {
  const decode = new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, seed);

      if (payload.exp <= moment().valueOf()) {
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
  createWixToken,
  decodeToken,
};
