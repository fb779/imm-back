/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const Process = require('../model/proceso.model');
const authWixSer = require('../services/authWix.services');

const campos = '_id first_name last_name email img role active createdAt updatedAt';

// metodo cargar los procesos
function getProcesses(req, res, next) {
    var body = req.body;

    res.status(200).json({
        data: {
            ok: true,
            message: 'llegamos a los procesos'
        }
    });
}

function getProcess(req, res, next) {
    var body = req.body;

    res.status(200).json({
        data: {
            ok: true,
            message: 'llegamos al procesos'
        }
    });
}

// metodo para la creacion de una solicitud y el proceso respectivo
function createProcess(req, res, next) {
    var body = req.body;

    User.findOne({ email: body.email }, campos).exec((err, userDB) => {
        // manejo de error de la peticion
        if (err) {
            return res.status(500).json({
                data: {
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                }
            });
        }

        if (userDB) {

            Process.find({ user: userDB._id, type_visa: body.visa, active: true }).exec((err, processBD) => {
                if (err) {
                    return res.status(500).json({
                        data: {
                            ok: false,
                            mensaje: 'Error al buscar proceso',
                            errors: err
                        }
                    });
                }

                console.log(processBD);
                if (processBD.length > 0) {
                    return res.status(200).json({
                        data: {
                            ok: false,
                            mensaje: 'El usuario tiene uno o mas proceso activo'
                        }
                    });
                }

                saveProcess(userDB, body.visa)
                    .then((response) => {
                        res.status(response.status).json({ data: response.data })
                    })
                    .catch((response) => {
                        res.status(response.status).json({ data: response.data });
                    });
            });



            // crear proceso pagado
        } else {
            // el usuario no existe y debe ser creado

            var nUser = new User();

            nUser.first_name = body.first_name;
            nUser.last_name = body.last_name;
            nUser.email = body.email;
            nUser.password = body.password;

            nUser.save((err, userSave) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar usuario',
                        errors: err
                    });
                }

                saveProcess(userSave, body.visa)
                    .then((response) => {
                        res.status(response.status).json({ data: response.data })
                    })
                    .catch((response) => {
                        res.status(response.status).json({ data: response.data });
                    });

            });
        }

    });
}


function saveProcess(user, visa) {
    const process = new Promise((resolve, reject) => {
        try {

            var process = new Process({
                user: user._id,
                type_visa: visa
            });

            process.save((err, saveProcess) => {
                if (err) {
                    reject({
                        status: 500,
                        data: {
                            ok: false,
                            mensaje: 'Error al crear el proceso',
                            errors: err
                        }
                    });
                }

                resolve({
                    status: 200,
                    data: {
                        ok: true,
                        user: user,
                        process: saveProcess
                    }
                });
            });

        } catch (error) {
            reject({
                status: 500,
                message: 'Error al crear el proceso',
                errors: error
            });
        }
    });

    return process;
}

module.exports = {
    // signinwix,
    createProcess,
    getProcesses,
    getProcess,
}