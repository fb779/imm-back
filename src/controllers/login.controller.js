/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const authSer = require('../services/auth.services');
const PasswordServices = require('../services/reset-password.services');
const UserService = require('../services/user.services');
const LoginService = require('../services/login.services');
const {sendMail, templates} = require('../services/nodemailer');

/**
 * Function to login user in app
 */
async function signin(req, res, next) {
  try {
    const {email, password} = req.body;

    const token = await LoginService.validLoginUserEmail(email, password);

    res.json({
      data: {
        ok: true,
        token,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
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

/**
 * Metodo para la solicitud del token de restablecimiento de password
 *    TODO: recibir el email del usuario que solicita el reset del password.
 *    TODO: validar que el email del usuario exista en la bd (puede ser un cliente, consultor u administrativo).
 *    TODO: validar si el usuario tiene solicitudes validas pendientes.
 *    TODO: crear el token para el ingreso desde el link de recuperación de clave.
 **/
async function requestPass(req, res, next) {
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
      // token: data.token,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

/**
 * Metodo para la solicitud del token de restablecimiento de password
 *    OK TODO: Validar el token, se hace por middleware (verificación de validez y fecha de expiración)
 *    OK TODO: recepción de los datos, password, confirmPassword, token, email
 *    OK TODO: validar el usuario exista en la bd
 *    OK TODO: verificar el password y confirmPassword y reglas de integridad para password seguros
 *    OK TODO: cambiar y guardar el nuevo password del usuario
 *    OK TODO: cambiar estado de registro de restablecimiento "status": false
 *    OK TODO: respuesta del server del proceso.
 **/
async function resetPass(req, res, next) {
  try {
    const {password, confirmPassword, token} = req.body; // OK TODO: recepción de los datos, password, confirmPassword, token, email

    const {email} = req.user;

    // OK TODO: validar el usuario exista en la bd
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      // throw { status: 400, ok: false, message: 'Invalid Email', };
      throw {
        status: 200,
      };
    }

    // OK TODO: verificar el password y confirmPassword y reglas de integridad para password seguros
    await UserService.validSafePassword(password, confirmPassword);

    // OK TODO: cambiar y guardar el nuevo password del usuario
    await UserService.resetPassword(email, password);

    // OK TODO: cambiar estado de registro de restablecimiento "status": false
    await PasswordServices.disableTokenResetPassword(email, token);

    res.status(200).json({
      ok: true,
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
    return res.status(status).json({
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
