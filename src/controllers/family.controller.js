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
        return res.status(500).json({
            ok: false,
            message: 'catch, llegamos a los familiares'
        });
    }
}

async function createFamilyMember(req, res, next) {
    try {
        const id_process = req.params.id_process;
        const body = req.body;
        // const relationship = req.body.relationship;

        // delete body.relationship;

        const familiMember = await FamilyService.createFamilyMember(id_process, body);

        res.status(200).json({
            ok: true,
            message: 'crear family member',
            familiMember

        });

    } catch (error) {
        return res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
    }
}

async function editFamilyMember(req, res, next) {
    try {

    } catch (error) {
        return res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
    }
}

async function deleteFamilyMember(req, res, next) {
    const id_process = req.params.id_process;
    const id_client = req.params.id_client;

    try {
        const familyMember = await FamilyService.deleteFamilyMember(id_process, id_client);
        res.status(200).json({
            ok: true,
            message: 'se elimino el familiar',
            id_process,
            id_client,
            familyMember
        })
    } catch (error) {
        // console.log(error);
        return res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
    }
}

module.exports = {
    getFamilyByProcess,
    createFamilyMember,
    editFamilyMember,
    deleteFamilyMember,
}