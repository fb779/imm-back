/************************************************
 *  Importaciones
 ************************************************/
const FamilyService = require('../services/family.services');

async function getFamilyByProcess(req, res, next) {
    try {
        const process = req.params.id_process;
        const list = await FamilyService.getFamilyByProcess(process);

        return res.status(200).json({
            ok: true,
            list
        });
    } catch (error) {
        errorHandler(error, res);
        // return res.status(500).json({
        //     ok: false,
        //     message: 'catch, llegamos a los familiares'
        // });
    }
}

async function createFamilyMember(req, res, next) {
    const id_process = req.params.id_process;
    const body = req.body;

    try {
        // const relationship = req.body.relationship;

        // delete body.relationship;

        const familiMember = await FamilyService.createFamilyMember(id_process, body);

        res.status(200).json({
            ok: true,
            message: 'crear family member',
            familiMember

        });

    } catch (error) {
        errorHandler(error, res);
        // return res.status(error.status).json({
        //     ok: false,
        //     message: error.message,
        //     errors: error.errors
        // });
    }
}

async function editFamilyMember(req, res, next) {
    const id_process = req.params.id_process;
    const body = req.body;
    try {
        const familyMember = await FamilyService.editFamilyMember(body);

        res.status(200).json({
            ok: true,
            message: 'Miembro de la familia editado',
            familyMember
        });
    } catch (error) {
        errorHandler(error, res);
        // return res.status(error.status).json({
        //     ok: false,
        //     message: error.message,
        //     errors: error.errors

        // });
    }
}

async function deleteFamilyMember(req, res, next) {
    const id_process = req.params.id_process;
    const id_client = req.params.id_client;

    try {
        const familyMember = await FamilyService.deleteFamilyMember(id_process, id_client);

        //


        res.status(200).json({
            ok: true,
            message: 'se elimino el familiar',
            id_process,
            id_client,
            familyMember
        })
    } catch (error) {
        errorHandler(error, res);
        // return res.status(error.status).json({
        //     ok: false,
        //     message: error.message,
        //     errors: error.errors

        // });
    }
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
    getFamilyByProcess,
    createFamilyMember,
    editFamilyMember,
    deleteFamilyMember,
}