/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const authSer = require('../services/auth.services');
const PasswordServices = require('../services/reset-password.services');
const UserService = require('../services/user.services');
const {sendMail, templates} = require('../services/nodemailer');

/**
 * Function to login user in app
 */
function signin(req, res, next) {
  const body = req.body;

  User.findOne({email: body.email, active: true}).exec((err, user) => {
    if (err) {
      return res.status(500).json({
        data: {
          ok: false,
          message: 'Error al buscar usuario',
          errors: [err],
        },
      });
    }

    if (!user) {
      return res.status(400).json({
        data: {
          ok: false,
          // messages: 'Credenciales incorrectas, usuario o password errados',
          errors: ['The credentials are incorrect, email or password has error'],
          // msa: 'email',
        },
      });
    }

    // validacion de verificacion del password para generar el token
    if (!user.verifyPassword(body.password)) {
      return res.status(400).json({
        data: {
          ok: false,
          errors: ['The credentials are incorrect, email or password has error'],
          // msa: 'password',
        },
      });
    }

    return res.status(200).json({
      data: {
        ok: true,
        token: authSer.createToken(user),
        // message: 'signin',
      },
    });
  });
}

/**
 * Function to register a new user
 */
function signup(req, res, next) {
  var body = req.body;

  var newUser = new User({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
  });

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({
        data: {
          ok: false,
          message: 'Error al crear usuario',
          errors: err,
        },
      });
    }

    return res.status(200).json({
      data: {
        ok: true,
        message: 'Create User',
        user,
      },
    });
  });
}

/**
 * Function to log out user
 */
function signout(req, res, next) {
  return res.status(200).json({
    data: {
      ok: true,
      errors: ['not work'],
      message: 'signout',
    },
  });
}

async function requestPass(req, res, next) {
  // OK TODO: recibir el email del usuario que solicita el reset del password.
  // OK TODO: validar que el email del usuario exista en la bd (puede ser un cliente, consultor u administrativo).
  // OK TODO: validar si el usuario tiene solicitudes validas pendientes.
  // OK TODO: guardar la información en la bd.
  // OK TODO: crear el token para el ingreso desde el link de recuperación de clave.
  // OK TODO: Enviar email con el link de recuperacion de la contraseña.
  // OK TODO: enviar respuesta de resultado de la solicitud.
  try {
    const {email} = req.body; // TODO: recibir el email del usuario que solicita el reset del password.

    // TODO: validar que el email del usuario exista en la bd (puede ser un cliente, consultor u administrativo).
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      // throw { status: 400, ok: false, message: 'Invalid Email', };
      throw {
        status: 200,
      };
    }

    // TODO: validar si el usuario tiene solicitudes validas pendientes.
    const existRequest = await PasswordServices.validExistResetRequest(email);
    if (existRequest) {
      // throw { status: 400, ok: false, message: `There is pending request`, };
      throw {
        status: 200,
      };
    }

    // TODO: crear el token para el ingreso desde el link de recuperación de clave.
    const data = await PasswordServices.createRequesPassword(user);

    if (data) {
      const mOption = {
        to: email,
        data: {
          user: email,
          link: data.token,
        },
      };
      const info = await sendMail(templates.reset_password, mOption);
    }

    res.status(200).json({
      ok: true,
      // request,
      // data,
      // token: data.token,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

function resetPass(req, res, next) {
  try {
    const {password, confirm} = req.body;

    const user = req.user;

    res.status(200).json({
      ok: true,
      message: 'Peticion resetPass',
      password,
      confirm,
      user,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
  const {status, message, error: er} = error;
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      errors: message,
      error: er,
    });
  }

  return res.status(500).json({
    ok: false,
    message: 'error internal auth services',
    error,
  });
};

/**
 * Exports function to login
 */
module.exports = {
  signin,
  signup,
  signout,
  requestPass,
  resetPass,
};
