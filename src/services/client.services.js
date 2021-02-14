const Client = require('../model/client.model');
const _ = require('underscore');

function getClientList() {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await Client.find();

      return resolve(list);
    } catch (error) {
      return reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

function getById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await Client.findById(id);

      if (!client) {
        return reject({
          status: 404,
          message: `Client isn't found`,
          errors: `The client doesn't find with this Id: ${id}`,
        });
      }

      return resolve(client);
    } catch (error) {
      return reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

// crear nuevo cliente
function createClient(newClient) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new Client(newClient);
      await client.save();

      resolve(client);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create client',
        errors: error,
      });
    }
  });
}

function editClient(id, editClient) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = _.pick(editClient, [
        'first_name',
        'last_name',
        'title',
        'sex',
        'email',
        'telephone',
        'birthday',
        'age',
        'country_citizenship',
        'other_citizenship',
        'country_residence',
        'status_residence',
        'status_residence_other',
        'active',
      ]);

      const client = await Client.findByIdAndUpdate(id, data, {new: true, runValidators: true, context: 'query'});

      if (!client) {
        reject({status: 400, message: "Error, client doesn't exist", errors: ''});
      }

      resolve(client);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit client',
        errors: error,
      });
    }
  });
}

function deleteClient(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await Client.findByIdAndRemove(id);

      // if (!client) {
      //   return reject({
      //     status: 400,
      //     message: "Error, the client doesn't deletel",
      //     errors: error,
      //   });
      // }

      return resolve(client);
    } catch (error) {
      return reject({
        status: 400,
        message: "Error, the client doesn't deletel",
        errors: error,
      });
    }
  });
}

function getByEmail(email) {
  return new Promise(async (resolve, reject) => {
    try {
      var client = await Client.findOne({email: email});

      if (!client) {
        reject({
          status: 404,
          message: `The client doesn't find with the Email: ${email}`,
          errors: `Client doesn't find with the Email`,
        });
      }

      resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

/** verificacion de existencia del usuario por el email */
function getClientByEmail(email) {
  return new Promise(async (resolve, reject) => {
    try {
      var client = await Client.findOne({email: email});
      resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

/** Consulta de clientes del mismo usuario */
function getClinetListByUser(user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      var client = await Client.find({user: user_id});
      resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

module.exports = {
  getClientList,
  getById,
  createClient,
  editClient,
  deleteClient,
  getByEmail,
  getClientByEmail,
  getClinetListByUser,
};
