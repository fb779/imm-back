/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const campos = '_id first_name last_name email img role active createdAt updatedAt';

/**
 * Busca un usuario por su identificador
 * Search and find user by Id
 */
function getUser(req, res, next) {
    var id = req.params.id;

    User.findById(id, campos)
        // .populate({ path: 'usuario', select: 'nombre email img' })
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        ok: false,
                        message: 'Error loading user',
                        err: err
                    }
                });
            }

            if (!user) {
                return res.status(400).json({
                    data: {
                        ok: false,
                        message: 'Error, the user ' + id + ' doesnt exist',
                        errors: [
                            'NO, the user does not exist with thi ID'
                        ]
                    }
                });
            }

            // user.password = ':)';
            return res.status(200).json({
                data: {
                    ok: true,
                    user
                }
            });
        });
}

/**
 * Listado general de usuarios existentes
 * es posible habilitar paginacion con las configuraciones respectivas
 */
function getUsers(req, res, next) {
    var offset = req.query.offset || 0;
    offset = Number(offset);
    var limit = req.query.limit || 20;

    User.find({}, campos)
        .skip(offset)
        .limit(limit)
        // .populate({ path: 'usuario', select: 'nombre email img' })
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        ok: false,
                        message: 'Error loading to users'
                    }
                });
            }

            User.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    data: {
                        ok: true,
                        users,
                        total: conteo
                    }
                });
            });
        });
}

function saveUser(req, res, next) {
    var body = req.body;
    console.log('save new user', req.body);

    var newUser = new User({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: body.password,
    });

    // valida si la data trae el rol o lo crea por defecto
    if (req.body.role) {
        newUser.role = req.body.role;
    }

    newUser.save((err, user) => {
        if (err) {
            return res.status(400).json({
                data: {
                    ok: false,
                    message: 'Error al crear usuario',
                    errors: err
                }
            });
        }

        return res.status(200).json({
            data: {
                ok: true,
                user
            }
        });
    });
}

function updateUser(req, res, next) {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, campos).exec((err, userEdit) => {
        if (err) {
            return res.status(500).json({
                data: {
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                }
            });
        }

        if (!userEdit) {
            return res.status(400).json({
                data: {
                    ok: false,
                    mensaje: 'Error, el usuario ' + id + ' no existe',
                    errors: { messages: 'NO existe un usuario con ese ID' }
                }
            });
        }

        userEdit.first_name = body.first_name;
        userEdit.last_name = body.last_name;
        // userEdit.email = body.email;
        userEdit.role = body.role;

        if (body.password) {
            userEdit.password = body.password;
        }

        userEdit.save((err, usSave) => {
            if (err) {
                return res.status(400).json({
                    data: {
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        errors: err
                    }
                });
                return;
            }

            // usuario.password = ':)';
            return res.status(200).json({
                data: {
                    ok: true,
                    usuario: usSave
                }
            });
        });
    });
}

function deleteUser(req, res, next) {

}


module.exports = {
    getUser,
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
}