const Client = require('../model/client.model');

function getById(id) {
  return new Promise(async(resolve, reject) => {
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
        message: 'Error, the client doesn\'t find',
        errors: error
      });
    }
  });
}

function getByEmail(email) {
  return new Promise(async(resolve, reject) => {
    try {
      var client = await Client.findOne({ email: email });

      if (!client) {
        reject({
          status: 404,
          message: `The client doesn't find with the Email: ${email}`,
          errors: `Client doesn't find with the Email`
        });
      }

      resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error, the client doesn\'t find',
        errors: error
      });
    }
  });
}
/** verificacion de existencia del usuario por el email */
function getClientByEmail(email) {
  return new Promise(async(resolve, reject) => {
    try {
      var client = await Client.findOne({ email: email });
      resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error, the client doesn\'t find',
        errors: error
      });
    }
  });
}

// crear nuevo cliente
function createClient(newClient) {
  return new Promise(async(resolve, reject) => {
    try {
      const client = new Client(newClient);
      await client.save();

      resolve(client);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create client',
        errors: error
      });
    }
  });
}

function editClient(id, editClient) {

  return new Promise(async(resolve, reject) => {
    try {
      const client = await Client.findById(id);

      if (!client) {
        reject({
          status: 400,
          message: 'Error, client doesn\'t exist',
          errors: ''
        });
      }

      if (editClient.first_name) { client.first_name = editClient.first_name; }
      if (editClient.last_name) { client.last_name = editClient.last_name; }
      if (editClient.title) { client.title = editClient.title; }
      if (editClient.sex) { client.sex = editClient.sex; }
      if (editClient.telephone) { client.telephone = editClient.telephone; }
      if (editClient.birthday) { client.birthday = editClient.birthday; }
      if (editClient.age) { client.age = editClient.age; }
      if (editClient.country_citizenship) { client.country_citizenship = editClient.country_citizenship; }
      if (editClient.other_citizenship) { client.other_citizenship = editClient.other_citizenship; }
      if (editClient.country_residence) { client.country_residence = editClient.country_residence; }
      if (editClient.status_residence) { client.status_residence = editClient.status_residence; }
      if (editClient.status_residence_other) { client.status_residence_other = editClient.status_residence_other; }
      if (editClient.active) { client.active = editClient.active; }

      await client.save();

      resolve(client);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit client',
        errors: error
      });
    }
  });
}


function deleteClient(id) {
  return new Promise(async(resolve, reject) => {
    try {
      const client = await Client.findByIdAndRemove(id);

      if (!client) {
        return reject({
          status: 400,
          message: 'Error, the client doesn\'t deletel',
          errors: error
        })
      }

      return resolve(client);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error, the client doesn\'t deletel',
        errors: error
      });
    }
  });
}


module.exports = {
  createClient,
  editClient,
  deleteClient,
  getById,
  getByEmail,
  getClientByEmail
}