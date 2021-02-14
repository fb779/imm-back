const Family = require('../model/family.model');
const Client = require('../model/client.model');
const ProcessService = require('./process.services');
const ClientService = require('./client.services');
const DocumentService = require('./document.services');

function getFamilyByUser(id_user) {
  return new Promise(async (resolve, reject) => {
    try {
      const process = await ProcessService.getProcessId(id_user);

      const {user, client} = process;

      let familyList = await ClientService.getClinetListByUser(user._id);

      familyList = familyList.filter((el) => {
        return el._id.toString() !== client._id.toString();
      });

      resolve(familyList);
    } catch (error) {
      reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

function getFamilyByProcess(id_process) {
  return new Promise(async (resolve, reject) => {
    try {
      const familyList = await Family.find({process: id_process})
        .select('-_id -process -createdAt -updatedAt -__v')
        .populate([{path: 'client', select: '-email -createdAt -updatedAt -__v -active'}]);

      resolve(familyList);
    } catch (error) {
      reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

function getFamilyMembersByProcesses(process) {
  return new Promise(async (resolve, reject) => {
    try {
      const familyList = await Family.find({process: {$in: process}})
        .select('-_id -process -createdAt -updatedAt -__v')
        .populate([{path: 'client', select: '-email -createdAt -updatedAt -__v -active'}]);

      resolve(familyList);
    } catch (error) {
      reject({
        status: 500,
        message: "Error, the client doesn't find",
        errors: error,
      });
    }
  });
}

function createFamilyMember(process_id, client) {
  return new Promise(async (resolve, reject) => {
    try {
      const process = await ProcessService.getProcessId(process_id);

      const {user} = process;

      const newClient = await ClientService.createClient({...client, user});

      // const family = new Family({client: newClient, process_id: process});
      // await family.save();

      resolve(newClient);
    } catch (error) {
      // await Client.findByIdAndRemove(newClient._id);
      reject({
        status: 500,
        message: 'Error al crear familiar',
        errors: error,
      });
    }
  });
}

function editFamilyMember(editClient) {
  return new Promise(async (resolve, reject) => {
    try {
      const {_id: id, ...data} = editClient;
      const client = await Client.findByIdAndUpdate(id, data, {new: true, runValidators: true}).select('-email -createdAt -updatedAt -active -__v');

      resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error al editar familiar',
        errors: error,
      });
    }
  });
}

function deleteFamilyMember(id_client) {
  return new Promise(async (resolve, reject) => {
    try {
      // TODO: eliminar los documentos asociados a el cliente
      // TODO: eliminar de la coleccion documentos
      const documents = await DocumentService.deleteDocumentsByClient(id_client);
      // TODO: eliminar de la coleccion familiares
      const member = await Family.findOneAndRemove({client: id_client});
      // TODO: eliminar de la coleccion clientes
      const client = await ClientService.deleteClient(id_client);

      return resolve(client);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error al eliminar un miembro de la familia',
        errors: error,
      });
    }
  });
}

function addFamilyMemberProcess(id_client, id_process) {
  return new Promise(async (resolve, reject) => {
    try {
      const family = await Family.create({client: id_client, process: id_process});

      resolve(family);
    } catch (error) {
      reject({
        status: 500,
        message: 'Error al crear familiar',
        errors: error,
      });
    }
  });
}

function removeFamilyMemberProcess(id_client, id_process) {
  return new Promise(async (resolve, reject) => {
    try {
      const family = await Family.findOneAndDelete({client: id_client, process: id_process});

      resolve(family);
    } catch (error) {
      await Client.findByIdAndRemove(newClient._id);
      reject({
        status: 500,
        message: 'Error al crear familiar',
        errors: error,
      });
    }
  });
}

module.exports = {
  getFamilyByProcess,
  getFamilyByUser,
  getFamilyMembersByProcesses,
  createFamilyMember,
  editFamilyMember,
  deleteFamilyMember,
  addFamilyMemberProcess,
  removeFamilyMemberProcess,
};
