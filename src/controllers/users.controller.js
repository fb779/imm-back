/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const UserService = require('../services/user.services');
const ClientService = require('../services/client.services');
const VisaCategoryServices = require('../services/visa-category.services');
const ProcessService = require('../services/process.services');
const {roles} = require('../config/config');

const campos = '_id first_name last_name email role active client img bio';

/************************************************
 *  Metodos
 ************************************************/

/**
 * Busca un usuario por su identificador
 * Search and find user by Id
 */
function getUser(req, res, next) {
  const id = req.params.id;

  User.findById(id, campos)
    .populate({path: 'client'})
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({
          data: {
            ok: false,
            message: 'Error loading user',
            err: err,
          },
        });
      }

      if (!user) {
        return res.status(400).json({
          data: {
            ok: false,
            message: 'Error, the user ' + id + ' doesnt exist',
            errors: ['NO, the user does not exist with thi ID'],
          },
        });
      }

      return res.status(200).json({
        data: {
          ok: true,
          user,
        },
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

  let filters = {};
  let populate = [{path: 'client', select: '-__v -createdAt -updatedAt'}]; // { path: '' };

  if (role) {
    filters[`role`] = {$in: role};
  }

  User.find(filters, campos)
    // .skip(offset)
    // .limit(limit)
    // .populate({ path: 'usuario', select: 'nombre email img' })
    .populate(populate)
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({
          data: {
            ok: false,
            message: 'Error loading to users',
            err,
          },
        });
      }

      res.status(200).json({
        data: {
          ok: true,
          users,
          total: users.length,
        },
      });
    });
}

async function createUser(req, res, next) {
  try {
    const body = req.body;

    let newUser = null;

    if (body.role.toUpperCase() === 'CLIENT_ROLE') {
      // verificacion y creacion del cliente
      let client = await ClientService.getClientByEmail(body.email);

      if (client === null) {
        client = await ClientService.createClient(body);
      }

      // creacion y verificacion del usuario
      newUser = await UserService.getUserByEmail(client.email);

      if (newUser === null) {
        body['client'] = client;
        newUser = await UserService.createUser(body);
      }

      // creacion del proceso
      const name_process = body.process;
      const visa_category = await VisaCategoryServices.getByName(name_process);

      const process = await ProcessService.createProcess({client, visa_category});
    } else {
      newUser = await UserService.createUser(body);
    }

    return res.status(200).json({
      ok: true,
      newUser,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id;
    const body = req.body;

    const userEdit = await UserService.updateUser(id, body);

    // if (user.role === roles.client) {
    //   userEdit.client = await ClientService.editClient(user.client, body);
    // }

    return res.status(200).json({
      ok: true,
      user: userEdit,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
}

async function updateUserPassword(req, res, next) {
  try {
    const user = req.user;
    const id = req.params.id;
    const password = req.body.old_password;
    const newPassword = req.body.new_password;

    if (id !== user._id && user.role !== roles.admin) {
      throw {status: 404, message: `You do not have permission to modify`};
    }

    const userEditPassword = await UserService.updatePassword(id, password, newPassword);

    return res.status(200).json({
      ok: true,
      data: userEditPassword,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
}

function getConsultants(req, res, next) {
  User.find({active: true, role: {$eq: 'USER_ROLE'}}, '_id first_name last_name email').exec((err, consultants) => {
    if (err) {
      return errorHandler(err);
      // return res.status(500).json({
      //   data: {
      //     ok: false,
      //     message: 'Problemas al cargar los consultores',
      //   },
      // });
    }

    return res.status(200).json({
      data: {
        ok: true,
        consultants,
      },
    });
  });
}

async function getValid(req, res, next) {
  try {
    const params = req.query;

    const exist = await UserService.validEmail(params);

    res.status(200).json({
      ok: true,
      data: exist,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
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
      error: error.errors,
    });
  }
  return res.status(500).json({
    ok: false,
    message: 'Error user services',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/
module.exports = {
  getUser,
  getListUsers,
  createUser,
  updateUser,
  updateUserPassword,
  getConsultants,
  getValid,
};
