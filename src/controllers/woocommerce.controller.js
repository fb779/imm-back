const WoocommerceServices = require('../services/woocommerce.services');
const ClientService = require('../services/client.services');
const UserService = require('../services/user.services');
const ProcessService = require('../services/process.services');
const VisaCategoryServices = require('../services/visa-category.services');

async function postWoocommerceWebhook(req, res, next) {
  // const body = req.body;
  // console.log('recibo de woocommerce', body);
  // return res.status(200).json({ ok: true, message: 'ok order' });

  try {
    // const body = req.body;
    // console.log('recibo de woocommerce', body);

    // Validación de información inicial
    let { billing, line_items } = validationsData(req.body);

    // respuesta de confirmacion
    res.status(200).json({ ok: true });

    // verificacion y creacion del cliente
    let client = await ClientService.getClientByEmail(billing.email);

    if (client === null) {
      client = await ClientService.createClient(billing);
    }

    // creacion y verificacion del usuario
    let user = await UserService.getUserByEmail(client.email);
    if (user === null) {
      billing['client'] = client;
      billing['password'] = await UserService.generatePassword();
      user = await UserService.createUser(billing);
    }

    // creacion del proceso
    const name_process = line_items[0].name;
    const visa_category = await VisaCategoryServices.getByName(name_process);

    const process = await ProcessService.createProcess({ client, visa_category })

    console.log('fin de la ejecucion', billing);
  } catch (error) {
    console.log('manejo del error', error);
    // errorHandler(error, res);
  }
}


/************************************************
 *  Metodo para el manejo de error
 ************************************************/

const validationsData = (body) => {
  // falla la llegada de informacion de woocommerce
  if (Object.keys(body).length === 0) {
    throw ({ status: 400, message: `Error, the information not exist` });
  }

  let { billing, line_items } = body;

  // fallo de la informacion del comprador, verificacion del email
  if (Object.keys(billing).length === 0 || !billing.hasOwnProperty('email') || !billing.email) {
    throw ({ status: 404, message: `Error, the billing information isn't exit` });
  }

  // fallo de la informacion de compra
  if (line_items.length === 0) {
    throw ({ status: 404, message: `Error, the product isn't exist` });
  }

  return { billing, line_items };
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
}

module.exports = {
  postWoocommerceWebhook
}