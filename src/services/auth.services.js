const seed = require('../config/config').seed;
const jwt = require('jsonwebtoken');
const moment = require('moment');

// metodo encargado de crear un token para las peticiones
function createToken(user) {
    user.password = ':)';
    user.img = '';

    let dt = moment();

    const payload = {
        sub: user._id,
        user,
        iat: dt.unix(),
        exp: dt.add(2, 'days').unix()
    }

    return jwt.sign(payload, seed);

}

// metodo encargado de validar (verificacion de firma y fecha) y decodificar el token
// en caso contrario genera un error
function decodeToken(token) {
    const decode = new Promise((resolve, reject) => {
        try {
            const payload = jwt.verify(token, seed);

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'Token expirado'
                });
            }

            resolve(payload);

        } catch (error) {
            reject({
                status: 500,
                message: 'Invalid token'
            });
        }
    });

    return decode;
}

module.exports = {
    createToken,
    decodeToken,
    // createWixToken,
}