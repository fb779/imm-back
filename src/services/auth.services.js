const seed = require('../config/config').seed;
const jwt = require('jsonwebtoken');
const moment = require('moment');

// metodo encargado de crear un token para las peticiones
function createToken(user) {
    user.password = ':)';
    const payload = {
        sub: user._id,
        user,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }
    return jwt.sign(payload, seed);

    // jwt.sign(payload, seed, function(err, token) {
    //     if (err) {
    //         console.log('error al crear el token', err);
    //     }
    //     console.log('creando el token', token);
    //     return token;
    // });

    // return token;
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
    decodeToken
}