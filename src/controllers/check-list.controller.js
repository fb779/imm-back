/************************************************
 *  Importaciones
 ************************************************/
const CheckList = require('../model/check-list.model');
const CheckListService = require('../services/check-list.services');
const VisaCategoriesServices = require('../services/visa-category.services');

async function getCheckList(req, res, next) {
    try {
        const type = req.query.type;
        let visa;

        const filter = { visa_categories: { $eq: visa } }

        if (!type) {
            return res.status(404).json({
                ok: true,
                messages: 'Type visa is required',
                error: {}
            });
        }

        if (type != 'all') {
            visa = await VisaCategoriesServices.getByName(type);
            filter["visa_categories"] = { $eq: visa };
        }

        const listCheckList = await CheckList.find(filter).select('-visa_categories -createdAt -updatedAt -__v'); //.populate({ path: 'visa_categories', match: { name: { $eq: "VISITOR" } } });

        // const listCheckList = await CheckList.find({}).select('-createdAt -updatedAt -__v'); //.populate({ path: 'visa_categories', match: { name: { $eq: "VISITOR" } } });

        // .populate({
        //     path: 'children',
        //     match: { age: { $gte: 18 }},
        //     select: 'name age -_id'
        //   })

        res.status(200).json({
            ok: true,
            visa,
            list: listCheckList
        });
    } catch (error) {
        console.log('verificando error en listado de checklist', error);
        res.status(500).json({
            ok: false,
            message: 'get check list visa categories by name',
            error
        });
    }
}

async function getCheckListId(req, res, next) {
    try {
        const id = req.params.id;

        const checkList = await CheckList.findById(id);

        if (!checkList) {
            return res.status(404).json({
                data: {
                    ok: true,
                    messages: 'Visa doesn\'t exist'
                }
            });
        }

        res.status(200).json({
            ok: true,
            check: checkList
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'getVisaCateoryId',
            error

        });
    }
}


async function createCheckListMasive(req, res, next) {
    try {
        var body = req.body;

        console.log('tipo de dato', Array.isArray(body));

        if (!Array.isArray(body)) {
            res.status(400).json({
                ok: false,
                message: `The data isn't the correct format`,
                error: {}
            })
        }




        await body.forEach(async(el, i, ob) => {
            console.log(`Objeto indice ${i}`, ob[i]);
            ob[i] = await CheckListService.createCheckList(el);
        });
        // console.log(body);

        res.status(200).json({
            ok: true,
            message: 'llegamos a los masivos',
            body
        });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
    }
}

async function createCheckList(req, res, next) {
    try {
        const body = req.body;

        // body.visa_categories = req.body.visa_categories.split(',');

        const checkList = await CheckListService.createCheckList(body);

        res.status(200).json({
            ok: true,
            check: checkList,
        });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
    }
}

async function editCheckList(req, res, next) {
    try {
        const id = req.params.id;
        const body = req.body;

        // if (body.visa_categories) {
        //     body.visa_categories = await req.body.visa_categories.split(',').filter((el) => (el.trim()) ? true : false).map((el) => el.trim());
        // }

        const checkList = await CheckListService.editCheckList(id, body);

        res.status(200).json({
            ok: true,
            check: checkList

        });
    } catch (error) {
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }
}

async function deleteCheckList(req, res, next) {
    try {
        const id = req.params.id;

        // const checkList = await CheckListService.deleteCheckList(id);
        const checkList = await CheckListService.disableCheckList(id);
        // const checkList = await CheckListService.enableCheckList(id);

        res.status(200).json({
            ok: true,
            check: checkList
        });
    } catch (error) {
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }
}


module.exports = {
    getCheckList,
    getCheckListId,
    createCheckList,
    editCheckList,
    deleteCheckList,
    createCheckListMasive,
}