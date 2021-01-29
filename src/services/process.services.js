const Process = require('../model/proceso.model');

function getProcesses(filter, populate) {
  return new Promise(async (resolve, reject) => {
    try {
      const listProcesses = await Process.find(filter).populate(populate).sort('visa_category');

      resolve(listProcesses);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to find Process',
        errors: error,
      });
    }
  });
}

function getProcessId(id_process, params = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const process = await Process.findById(id_process)
        .select('-__v -createdAt -updatedAt')
        .populate([
          {path: 'client', select: '-active -createdAt -updatedAt -__v'},
          {path: 'visa_category', select: '-createdAt -updatedAt -__v'},
        ]);

      if (!process) {
        return reject({
          status: 404,
          message: `The Process isn't found`,
          errors: `The process doesn't find with this Id: ${id_process}`,
        });
      }

      return resolve(process);
    } catch (error) {
      return reject({
        status: 400,
        message: 'Error to find the Process',
        errors: error,
      });
    }
  });
}

function getProcessesByClient(id_client) {
  return new Promise(async (resolve, reject) => {
    try {
      const listProcesses = await Process.find({client: id_client}).populate([
        {path: 'client', select: '-active -createdAt -updatedAt -__v'},
        {path: 'consultant', select: '-active -createdAt -updatedAt -__v'},
        {path: 'visa_category', select: '-createdAt -updatedAt -__v'},
      ]);

      resolve(listProcesses);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to create Process',
        errors: error,
      });
    }
  });
}

// crear nuevo Process
function createProcess(newProcess) {
  return new Promise(async (resolve, reject) => {
    try {
      const listProcess = await Process.find({active: true, client: newProcess.client, visa_category: newProcess.visa_category});

      if (listProcess.length > 0) {
        throw {
          status: 400,
          message: 'Error, The client has process active',
          errors: 'The client has process active',
        };
      }

      const process = new Process(newProcess);

      await process.save();

      return resolve(process);
    } catch (error) {
      reject(error);
    }
  });
}

function editProcess(id, newProcess) {
  return new Promise(async (resolve, reject) => {
    try {
      const process = await Process.findById(id);

      if (!process) {
        return reject({
          status: 400,
          message: "Error, Process doesn't exist",
          errors: '',
        });
      }

      if (newProcess.client) {
        process.client = newProcess.client;
      }
      if (newProcess.consultant) {
        process.consultant = newProcess.consultant;
      }
      if (newProcess.visa_category) {
        process.visa_category = newProcess.visa_category;
      }
      // if (newProcess.code) { process.code = newProcess.code; }
      // if (newProcess.status) { process.status = newProcess.status; }
      // if (newProcess.active) { process.active = newProcess.active; }

      // await process.save();

      resolve(process);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit Visa-Category',
        errors: error,
      });
    }
  });
}

function disableProcess(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const process = await Process.findByIdAndRemove(id);

      if (!process) {
        reject({
          status: 400,
          message: "Error, the Process doesn't delete",
          errors: error,
        });
      }

      if (process.active) {
        process.active = false;
      }

      resolve(process);
    } catch (error) {
      reject({
        status: 400,
        message: "Error, the Process doesn't deletel",
        errors: error,
      });
    }
  });
}

function setStatusStep(id, status) {
  return new Promise(async (resolve, reject) => {
    try {
      const filter = {$set: {'steps.$.status': status}};

      const data = await Process.findOneAndUpdate({steps: {$elemMatch: {_id: id}}}, filter, {new: true, runValidators: true}).select('steps');

      resolve(data);
    } catch (error) {
      reject({
        status: 400,
        message: 'Error to edit status step',
        errors: error,
      });
    }
  });
}

module.exports = {
  getProcesses,
  getProcessId,
  getProcessesByClient,
  createProcess,
  editProcess,
  disableProcess,
  setStatusStep,
};
