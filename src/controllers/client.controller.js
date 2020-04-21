/************************************************
 *  Importaciones
 ************************************************/
const Client = require('../model/client.model');
const ClientService = require('../services/client.services');
const moment = require('moment');

// metodo cargar todos los procesos del usuario
async function getClientes(req, res, next) {
    Client.find().exec((err, listClients) => {
        if (err) {
            return res.status(500).json({
                data: {
                    ok: false,
                    errors: err,
                }
            });
        }

        return res.status(200).json({
            data: {
                ok: true,
                list: listClients
            }
        });
    });
}

async function getClienteId(req, res, next) {
    try {
        const id = req.params.id;

        const client = await Client.findById(id);

        if (!client) {
            return res.status(200).json({
                data: {
                    ok: true,
                    messages: 'Client doesn\'t exist'
                }
            })
        }

        return res.status(200).json({
            data: {
                ok: true,
                client
            }
        })
    } catch (error) {
        return res.status(500).json({
            data: {
                ok: true,
                messages: 'edit client to id',
                errors: error
            }
        })
    }
}

async function createCliente(req, res, next) {
    try {
        var body = req.body;
        const client = await ClientService.createClient(body);

        return res.status(200).json({
            data: {
                ok: true,
                client
            }
        });
    } catch (error) {
        res.status(error.status).json({
            data: {
                ok: false,
                messages: error.message,
                errors: error.errors
            }
        })
    }
}

async function editCliente(req, res, next) {
    try {
        const id = req.params.id;
        var body = req.body;

        const client = await ClientService.editClient(id, body);

        return res.status(200).json({
            data: {
                ok: true,
                messages: 'edit client to id',
                client
            }
        })
    } catch (error) {
        res.status(error.status).json({
            data: {
                ok: false,
                messages: error.message,
                errors: error.errors
            }
        })
    }

}

async function deleteCliente(req, res, next) {
    try {
        const id = req.params.id;

        const client = await ClientService.deleteClient(id);

        return res.status(200).json({
            data: {
                ok: true,
                messages: 'deleted client to id',
                client
            }
        })
    } catch (error) {
        res.status(error.status).json({
            data: {
                ok: false,
                messages: error.message,
                errors: error.errors
            }
        })
    }
}


module.exports = {
    getClientes,
    getClienteId,
    createCliente,
    editCliente,
    deleteCliente,
}