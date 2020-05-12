/************************************************
 *  Importaciones
 ************************************************/
const DocumentServices = require('../services/document.services');
const ProcessService = require('../services/process.services');
const ClientService = require('../services/client.services');
const CheckListService = require('../services/check-list.services');
const { typesDocument } = require('../config/config');

/************************************************
 *  Deficnicion de metodos
 ************************************************/

async function getDocuments(req, res, next) {
    try {
        const type = req.query.type || null;
        const id = req.query.id || null;

        if (!type) {
            throw ({
                status: 400,
                message: `Error en los parametros`,
                errors: {}
            });
        }

        // const documents = [];
        const documents = await DocumentServices.getDocuments(type, id);

        res.status(200).json({
            ok: true,
            list: documents,
        })
    } catch (error) {
        errorHandler(error, res);

    }
}

async function getDocumentsByProcessClient(req, res, netx) {
    try {
        const id_process = req.params.id_process;
        const id_client = req.params.id_client;

        const process = await ProcessService.getProcessId(id_process);
        const client = await ClientService.getById(id_client);

        // const documents = [];
        const documents = await DocumentServices.getDocumentsByProcessClient(process._id, client._id);

        res.status(200).json({
            ok: true,
            list: documents,
        })
    } catch (error) {
        errorHandler(error, res);

    }
}

async function getDocumentsByCliente(req, res, next) {
    try {
        const client = req.params.id_client;

        const documents = await DocumentServices.getDocumentsByClientId(client);

        res.status(200).json({
            ok: true,
            list: documents
        })
    } catch (error) {
        errorHandler(error, res);

    }
}

async function saveDocumentsByCliente(req, res, next) {
    try {
        const id_client = req.params.id_client;
        const id_process = req.body.id_process || '';
        const ids_checkList = req.body.list_checks || '';

        if (!ids_checkList) {
            return res.status(400).json({
                ok: false,
                message: 'Faltan los documentos viejo'
            })
        }

        const process = await ProcessService.getProcessId(id_process);
        const client = await ClientService.getById(id_client);

        const checkList = await (await CheckListService.getCheckListByIds(ids_checkList)).map(({ _id, name }) => ({ process: process._id, client: client._id, checklist: _id, name, }));

        // const documents = await DocumentServices.getDocumentsByClientId(client._id)
        const documents = await DocumentServices.getDocumentsByProcessClient(process._id, client._id)

        const create = newDocuments(checkList, documents);
        const remove = removeDocuments(documents, checkList);

        if (create.length > 0) {
            await DocumentServices.createDocumentsByClient(create);
        }

        if (remove.length > 0) {
            await DocumentServices.deleteDocuments(remove);
        }

        return res.status(200).json({
            ok: true,
            message: 'This checklist is updated',
            documents,
            create,
            remove,
        });
    } catch (error) {
        errorHandler(error, res);
    }
}


/************************************************
 *  Metodo para otras funciones
 ************************************************/

const newDocuments = (news, saved) => {
    const listado = saved.map(el => (el.checklist.toString()));

    return news.filter(el => {
        return (listado.indexOf(el.checklist.toString()) == -1) ? true : false;
    })
}

const removeDocuments = (saved, news) => {
    const listado = news.map(el => (el.checklist.toString()));

    return saved.filter(el => {
        return (listado.indexOf(el.checklist.toString()) == -1) ? true : false;
    });
}

/************************************************
 *  Metodo para el manejo de error
 ************************************************/
const errorHandler = (error, res) => {
    console.log('error para verificacion', error);
    if (error.hasOwnProperty('status')) {
        return res.status(error.status).json({
            ok: false,
            message: error.message,
            error: error.errors
        })
    }
    return res.status(500).json({
        ok: true,
        message: 'error en el servicio de creacion del listado de documentos',
        error
    })
}

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
    getDocuments,
    getDocumentsByCliente,
    getDocumentsByProcessClient,
    saveDocumentsByCliente,
}