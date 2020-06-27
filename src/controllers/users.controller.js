/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const userServices = require('../services/user.services');
const campos = '_id first_name last_name email role active client img';

/************************************************
 *  Metodos
 ************************************************/

/**
 * Busca un usuario por su identificador
 * Search and find user by Id
 */
function getUser(req, res, next) {
  var id = req.params.id;

  User.findById(id, campos)
    .populate({ path: 'client' })
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({
          data: {
            ok: false,
            message: 'Error loading user',
            err: err
          }
        });
      }

      if (!user) {
        return res.status(400).json({
          data: {
            ok: false,
            message: 'Error, the user ' + id + ' doesnt exist',
            errors: [
              'NO, the user does not exist with thi ID'
            ]
          }
        });
      }

      return res.status(200).json({
        data: {
          ok: true,
          user
        }
      });
    });
}

/**
 * Listado general de usuarios existentes
 * es posible habilitar paginacion con las configuraciones respectivas
 */
function getListUsers(req, res, next) {

  let offset = req.query.offset || 0;
  offset = Number(offset);
  let limit = req.query.limit || 20;
  let role = req.query.role || null;

  let filters = {}

  if (role) {
    filters[`role`] = { $in: role };
  }

  User.find(filters, campos)
    .skip(offset)
    .limit(limit)
    // .populate({ path: 'usuario', select: 'nombre email img' })
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({
          data: {
            ok: false,
            message: 'Error loading to users',
            err
          }
        });
      }

      res.status(200).json({
        data: {
          ok: true,
          users,
          total: users.length
        }
      });

    });
}

function createUser(req, res, next) {
  var body = req.body;

  var newUser = new User({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
  });

  // valida si la data trae el rol o lo crea por defecto
  if (req.body.role) {
    newUser.role = req.body.role;
  }

  if (req.body.client) {
    newUser.client = req.body.client;
  }

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({
        data: {
          ok: false,
          message: 'Error al crear usuario',
          errors: err
        }
      });
    }

    return res.status(200).json({
      data: {
        ok: true,
        user
      }
    });
  });
}

async function updateUser(req, res, next) {
  try {
    var id = req.params.id;
    var body = req.body;

    const user = await userServices.updateUser(id, body);

    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    return errorHandler(error, res);
  }

  // User.findById(id, campos).exec((err, userEdit) => {
  //   if (err) {
  //     return res.status(500).json({
  //       data: {
  //         ok: false,
  //         mensaje: 'Error al buscar usuario',
  //         errors: err
  //       }
  //     });
  //   }

  //   if (!userEdit) {
  //     return res.status(400).json({
  //       data: {
  //         ok: false,
  //         mensaje: 'Error, The user Id ' + id + ' doesn\'t exist',
  //         errors: { messages: 'The user do not exist' }
  //       }
  //     });
  //   }

  //   userEdit.first_name = body.first_name;
  //   userEdit.last_name = body.last_name;
  //   userEdit.role = body.role;

  //   // if (body.password) {
  //   //   userEdit.password = body.password;
  //   // }

  //   if (body.active) {
  //     userEdit.active = body.active;
  //   }

  //   if (body.client) {
  //     userEdit.client = body.client;
  //   } else {
  //     userEdit.client = null;
  //   }

  //   userEdit.save((err, usSave) => {
  //     if (err) {
  //       return res.status(400).json({
  //         data: {
  //           ok: false,
  //           mensaje: 'Error al actualizar el usuario',
  //           errors: err
  //         }
  //       });
  //       return;
  //     }

  //     return res.status(200).json({
  //       data: {
  //         ok: true,
  //         usuario: usSave
  //       }
  //     });
  //   });
  // });
}

function getConsultants(req, res, next) {

  User.find({ active: true, role: { $eq: "USER_ROLE" } }, '_id first_name last_name email').exec((err, consultants) => {
    if (err) {
      return res.status(500).json({
        data: {
          ok: false,
          message: 'Problemas al cargar los consultores'
        }
      });
    }

    return res.status(200).json({
      data: {
        ok: true,
        consultants
      }
    });
  });
}

// function getListClients(req, res, next){}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
      error: error.errors
    })
  }
  return res.status(500).json({
    ok: true,
    message: 'Error user services',
    error
  })
}

/************************************************
 *  Export de metodos
 ************************************************/
module.exports = {
  getUser,
  getListUsers,
  createUser,
  updateUser,
  getConsultants
}