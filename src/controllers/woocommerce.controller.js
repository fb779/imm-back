const ClientService = require('../services/client.services');
const UserService = require('../services/user.services');
const ProcessService = require('../services/process.services');
const VisaCategoryServices = require('../services/visa-category.services');

const {roles} = require('../config/config');

async function postWoocommerceWebhook(req, res, next) {
  try {
    // Validación de información inicial
    let {
      billing,
      billing: {email},
      line_items,
    } = validationsData(req.body);

    // respuesta de confirmacion
    // res.status(200).json({ ok: true });

    // creacion y verificacion del usuario
    let user = await UserService.getUserByEmail(email);
    if (user === null) {
      billing['role'] = roles.client;
      billing['password'] = await UserService.generatePassword();
      user = await UserService.createUser(billing);
    }

    // verificacion y creacion del cliente
    let client = await ClientService.getClientByEmail(billing.email);

    if (client === null) {
      billing['user'] = user;
      client = await ClientService.createClient(billing);
    }

    user = await UserService.updateUserClient(user._id, client);

    // creacion del proceso
    const product = line_items[0].name;
    const visa_category = await VisaCategoryServices.getByProduct(product);

    const process = await ProcessService.createProcess({user, client, visa_category});

    // if (process) {
    //   console.log('fin de la ejecucion', billing);
    // }

    // res.status(200).json({ok: true, client, user, process});
    res.status(200).json({ok: true});
  } catch (error) {
    // console.log('manejo del error', error);
    errorHandler(error, res);
  }
}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/

const validationsData = (body) => {
  // falla la llegada de informacion de woocommerce
  if (Object.keys(body).length === 0) {
    throw {status: 400, message: `Error, the information not exist`};
  }

  let {billing, line_items} = body;

  // fallo de la informacion del comprador, verificacion del email
  if (Object.keys(billing).length === 0 || !billing.hasOwnProperty('email') || !billing.email) {
    throw {status: 404, message: `Error, the billing information isn't exit`};
  }

  // fallo de la informacion de compra
  if (line_items.length === 0) {
    throw {status: 404, message: `Error, the product isn't exist`};
  }

  return {billing, line_items};
};

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
  if (error.hasOwnProperty('status')) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
      // error: error.errors
    });
  }
  return res.status(500).json({
    ok: false,
    message: 'Error, error inesperado',
    // error
  });
};

module.exports = {
  postWoocommerceWebhook,
};
