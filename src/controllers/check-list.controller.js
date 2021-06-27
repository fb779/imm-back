/************************************************
 *  Importaciones
 ************************************************/
// const CheckList = require('../model/check-list.model');
const CheckListService = require('../services/check-list.services');
const VisaCategoriesServices = require('../services/visa-category.services');

async function getCheckList(req, res, next) {
  try {
    const type = req.query.type;

    const filter = {};

    const visa = await VisaCategoriesServices.getByTitle(type);

    if (type != 'all' && (!type || !visa)) {
      return res.status(404).json({
        ok: true,
        messages: 'Required a valid type of visa',
        error: {},
      });
    }

    if (type != 'all') {
      filter['state'] = true;
      filter['visa_categories'] = {$in: [visa._id]};
    }

    const listCheckList = await CheckListService.getListCheckList(filter);

    res.status(200).json({
      ok: true,
      visa,
      list: listCheckList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function getCheckListId(req, res, next) {
  try {
    const id = req.params.id;

    const checkList = await CheckListService.getCheckListById(id);

    if (!checkList) {
      return res.status(404).json({
        data: {
          ok: true,
          messages: "Visa doesn't exist",
        },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'consulta del checklist',
      check: checkList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createCheckListMasive(req, res, next) {
  try {
    var body = req.body;

    if (!Array.isArray(body)) {
      res.status(400).json({
        ok: false,
        message: `The data isn't the correct format`,
        error: {},
      });
    }

    await body.forEach(async (el, i, ob) => {
      ob[i] = await CheckListService.createCheckList(el);
    });

    res.status(200).json({
      ok: true,
      message: 'llegamos a los masivos',
      body,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function createCheckList(req, res, next) {
  try {
    const body = req.body;

    const checkList = await CheckListService.createCheckList(body);

    res.status(200).json({
      ok: true,
      check: checkList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function editCheckList(req, res, next) {
  try {
    const id = req.params.id;
    const body = req.body;

    const checkList = await CheckListService.editCheckList(id, body);

    return res.status(200).json({
      ok: true,
      check: checkList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function deleteCheckList(req, res, next) {
  try {
    const id = req.params.id;

    const checkList = await CheckListService.disableCheckList(id);

    return res.status(200).json({
      ok: true,
      check: checkList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

async function validName(req, res, next) {
  try {
    const name = req.params.name;

    const check = await CheckListService.getCheckListByName(name.toUpperCase());

    const data = check.length > 0 ? true : false;

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    errorHandler(error, res);
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
      error: error.errors,
    });
  }
  return res.status(500).json({
    ok: false,
    message: 'Error services check-list',
    error,
  });
};

/************************************************
 *  Export de metodos
 ************************************************/

module.exports = {
  getCheckList,
  getCheckListId,
  createCheckList,
  editCheckList,
  deleteCheckList,
  createCheckListMasive,
  validName,
};
