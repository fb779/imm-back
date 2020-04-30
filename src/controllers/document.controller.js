/************************************************
 *  Importaciones
 ************************************************/
const DocumentServices = require('../services/document.services');
const ClientService = require('../services/client.services');
const CheckListService = require('../services/check-list.services');

/************************************************
 *  Deficnicion de metodos
 ************************************************/

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
    const id_client = req.params.id_client;
    try {
        const body = req.body.documents || '';

        if (!body) {
            return res.status(400).json({
                ok: false,
                message: 'Faltan los documentos viejo'
            })
        }

        const client = await ClientService.getById(id_client);

        const checkList = await (await CheckListService.getCheckListByIds(body)).map(({ _id, name }) => ({ checklist: _id, client: client._id, name, }));

        const documents = await DocumentServices.getDocumentsByClientId(client._id)

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
    getDocumentsByCliente,
    saveDocumentsByCliente
}