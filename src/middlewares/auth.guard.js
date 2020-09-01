const authSer = require('./../services/auth.services');

// funcion de verificacion de token valido para autenticar la peticion
function isAuth(req, res, next) {
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

function extractToken(req) {
  let token = '';

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  return token;
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
  isAuth,
};
