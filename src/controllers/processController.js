/************************************************
 *  Importaciones
 ************************************************/
const User = require('../model/user.model');
const Process = require('../model/proceso.model');
const FormVisitor = require('../model/form-visitor.model');
const campos = '_id first_name last_name email role active';

// metodo cargar todos los procesos del usuario
function getProcesses(req, res, next) {
    var user = req.user || 'no hay usuario';

    Process.find({ user: user._id }, '_id type_visa active status')
        //.populate({ path: 'user', select: '_id first_name last_name email' })
        .exec((err, processes) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        ok: false,
                        message: 'Fallo al cargar el proceso',
                        err
                    }
                });
            }

            return res.status(200).json({
                data: {
                    ok: true,
                    message: 'llegamos a los proceso',
                    // user,
                    processes
                }
            });

        });
}

// metodo para cargar un proceso por ID de usuario
function getProcess(req, res, next) {
    var id = req.params.id || 'no llego';
    var user = req.user || 'no hay usuario';

    Process.findOne({ _id: id, user: user._id }, '_id type_visa active status')
        //.populate({ path: 'user', select: '_id first_name last_name email' })
        .exec((err, process) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        ok: false,
                        message: 'Fallo al cargar el proceso',
                        err
                    }
                });
            }

            if (!process) {
                return res.status(401).json({
                    data: {
                        ok: false,
                        message: 'No puede acceder a ese proceso'
                    }
                });
            }


            return res.status(200).json({
                data: {
                    ok: true,
                    message: 'llegamos al proceso',
                    // id,
                    process
                }
            });

        });
}

// metodo para cargar un proceso por Id de proceso
function getFormProcess(req, res, next) {
    var id = req.params.id;
    var user = req.user;

    FormVisitor.findOne({ process: id }).exec((err, form) => {
        if (err) {
            return res.status(500).json({
                data: {
                    ok: false,
                    message: 'Error al cargar el formulario por el proceso',
                    errors: err
                }
            });
        }

        return res.status(200).json({
            data: {
                ok: true,
                message: 'Cargando el fomrulario por el proceso',
                form
            }
        });
    });

}

function getProcessToAssignan(req, res, next) {

    Process.find({ active: true, status: 'FORM' })
        // .populate({ path: 'user', select: '_id first_name last_name email' })
        .populate({ path: 'user', select: '_id first_name last_name email' })
        .populate({ path: 'consultan' })
        .exec((err, processes) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        ok: false,
                        message: 'Problemas la carga de procesos',
                        errors: err
                    }
                });
            }

            return res.status(200).json({
                data: {
                    ok: true,
                    message: 'procesos cargados con exito',
                    processes
                }
            });
        });
}

setAssignConsultan = (req, res, next) => {
    var body = req.body;
    var user = req.user;
    console.log('llegamos aqui', user, body);

    return res.status(200).json({
        data: {
            ok: true,
            message: 'llegamos aqui'
        }
    });
}

// Metodo que guarda un formulario VISITOR
function saveForm(req, res, next) {
    var body = req.body;
    var user = req.user;

    body.user = user._id;

    frmVisitor = new FormVisitor(body);

    Process.findById(body.process).exec((err, process) => {
        if (err) {
            return res.status(500).json({
                data: {
                    ok: false,
                    message: 'Problemas con encontrar el proceso asociado',
                    errors: err
                }
            });
        }

        if (!process) {
            return res.status(400).json({
                data: {
                    ok: false,
                    message: 'No se encuentra el proceso asociado con ese ID',
                }
            });
        }

        process.status = 'FORM';

        process.save((err, saveProcess) => {
            if (err) {
                return res.status(500).json({
                    data: {
                        ok: false,
                        message: 'No se puede actualizar el proceso',
                        errors: err
                    }
                });
            }

            frmVisitor.save((err, saveForm) => {
                if (err) {
                    return res.status(500).json({
                        data: {
                            ok: false,
                            message: 'No se puede guardar el formulario',
                            errors: err
                        }
                    });
                }

                return res.status(200).json({
                    data: {
                        ok: true,
                        form: saveForm,
                        user,
                    }
                });
            });

        });
    });
}

// metodo para la creacion de una solicitud y el proceso respectivo
// se crea el proceso con el usuario asociado
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

                // crear proceso pagado
                saveProcess(userDB, body.visa)
                    .then((response) => {
                        res.status(response.status).json({ data: response.data })
                    })
                    .catch((response) => {
                        res.status(response.status).json({ data: response.data });
                    });
            });


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

// metodo para crear un proceso con su usuario asociado
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
    getFormProcess,
    getProcessToAssignan,
    saveForm,
    setAssignConsultan,
}