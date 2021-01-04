const authSer = require('./../services/auth.services');

// funcion de verificacion de token valido para autenticar la peticion
function isValidToken(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).send({
      data: {
        ok: false,
        message: "You don't have authorization",
      },
    });
  }

  authSer
    .decodeToken(token)
    .then((response) => {
      req.user = response.user;
      next();
    })
    .catch((response) => {
      res.status(response.status).send({
        data: {
          ok: false,
          message: response.message,
        },
      });
    });
}

/**
 * Middleware para extraer el token del encabezado de la petición
 *    permite la extraccion del token del encabezado de autorización o por parametro en la url
 */
function extractToken(req) {
  let token = '';

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  return token;
}

/**
 * Middleware para validar el token de restablecimiento del password
 */
function validResetToken(req, res, next) {
  const token = extractBodyToken(req);

  if (!token) {
    return res.status(401).send({
      ok: false,
      message: 'Token was wront',
    });
  }

  authSer
    .decodeResetToken(token)
    .then((response) => {
      req.user = response.user;
      next();
    })
    .catch((response) => {
      res.status(response.status).send({
        data: {
          ok: false,
          message: response.message,
        },
      });
    });
}

/**
 * Metodo para extraer el token del body de la petición
 */
function extractBodyToken(req) {
  let {token} = req.body;
  // delete req.body.token; // eliminacion del token en el body
  return token;
}

/**
 * Metodo encargado de validar si la cuenta de los usuarios con role client_role esta activa por fecha de expiracion
 */
function isAcountActive(req, res, next) {
  const {
    user: {_id: id},
  } = req;

  authSer
    .isAcountActive(id)
    .then((isActive) => {
      if (!isActive) {
        return res.status(404).send({
          data: {
            ok: false,
            message: "You don't have authorization",
          },
        });
      }

      next();
    })
    .catch((err) => {
      return res.status(404).send({
        data: {
          ok: false,
          message: "You don't have authorization",
        },
      });
    });
}

// funcion de verificacion de token valido para autenticar la peticion
function isAdminRole(req, res, next) {
  next();
}

function isUserRole(req, res, next) {
  next();
}

function isClientRole(req, res, next) {
  next();
}

module.exports = {
  isValidToken,
  isAcountActive,
  validResetToken,
};
