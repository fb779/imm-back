const authSer = require('./../services/auth.services');

// funcion de verificacion de token valido para autenticar la peticion
function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({
            data: {
                ok: false,
                message: 'You dont have authorization'
            }
        });
    }

    const token = req.headers.authorization.split(' ')[1];

    authSer.decodeToken(token)
        .then((response) => {
            req.user = response.user;
            next();
        })
        .catch((response) => {
            res.status(response.status).send({
                data: {
                    ok: false,
                    message: response.message
                }
            });
        });
}

module.exports = {
    isAuth
}