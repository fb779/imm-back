/************************************************
 *  Importaciones
 ************************************************/
const Process = require('../model/proceso.model');
const ProcessServices = require('../services/process.services');
const FormServices = require('../services/form.services');
const ClientServices = require('../services/client.services');
const VisaCategoryServices = require('../services/visa-category.services');
const campos = '_id first_name last_name email role active';

async function getProcess(req, res, next) {
    try {
        const user = req.user || null;

        var ListProcess = [];

        switch (user.role) {
            case 'ADMIN_ROLE':
                {
                    ListProcess = await Process.find({ status: 'FORM' }).populate({ path: 'client' }).populate({ path: 'visa_category' });
                }
                break;
            case 'USER_ROLE':
                {
                    ListProcess = await Process.find({ consultant: user._id, status: 'ASIGNED' }).populate({ path: 'client' }).populate({ path: 'visa_category' });
                }
                break;
            case 'CLIENT_ROLE':
                {
                    ListProcess = await Process.find({ client: user.client }).populate({ path: 'client' }).populate({ path: 'visa_category' });
                }
                break;
                // default:
                //     {

                //     }
                //     break;
        }

        res.status(200).json({
            ok: true,
            list: ListProcess
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error, Process',
            error

        });
    }
}

async function getProcessId(req, res, next) {
    try {
        const id = req.params.id;
        const user = req.user;

        const process = await Process.findOne({ _id: id }).populate([{ path: 'client', select: '-active -createdAt -updatedAt -__v' }, { path: 'visa_category', select: '-createdAt -updatedAt -__v' }]);

        if (!process) {
            return res.status(404).json({
                data: {
                    ok: true,
                    messages: 'Process doesn\'t exist'
                }
            });
        }

        // verificacion de identidad para el proceso
        // if (process.client._id.toString() !== user.client) {
        //     return res.status(403).json({
        //         data: {
        //             ok: true,
        //             messages: `You don't have permissions`
        //         }
        //     });
        // }

        res.status(200).json({
            ok: true,
            process
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error, Process',
            error

        });
    }
}

async function createProcess(req, res, next) {
    try {
        const body = req.body;

        // consultar el cliente
        const client = await ClientServices.getByEmail(body.client);

        // consultar el tipo de visado
        const visa = await VisaCategoryServices.getByName(body.visa_category);

        body.client = client;
        body.visa_category = visa;

        const process = await ProcessServices.createProcess(body);

        res.status(200).json({
            ok: true,
            body,
            process,
        });
    } catch (error) {
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors

        });
    }
}

async function editProcess(req, res, next) {
    try {
        const id_process = req.params.id;
        const user = req.user;
        const body = req.body;
        const id_form = body._id;

        // consultar el proceso
        const process = await Process.findById(id_process)

        if (!process) {
            return res.status(404).json({
                data: {
                    ok: false,
                    messages: 'Process doesn\'t exist'
                }
            });
        }

        if (body.client && process.client != body.client) {
            process.client = body.client;
        }

        if (body.consultant && process.consultant != body.consultant) {
            process.consultant = body.consultant;
        }

        // if (body.visa_category && process.visa_category != body.visa_category) {
        //     process.visa_category = body.visa_category;
        // }

        // if (body.code && process.code != body.code) {
        //     process.code = body.code;
        // }

        if (body.status && process.status != body.status) {
            process.status = body.status;
        }

        // if (body.active && process.active != body.active) {
        //     process.active = body.active;
        // }

        // guardado del proceso con el consultor
        await process.save();


        return res.status(200).json({
            ok: true,
            process,
        });
    } catch (error) {
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }
}

// async function deleteProcess(req, res, next) {
//     try {
//         const id = req.params.id;

//         // const checkList = await CheckListService.deleteCheckList(id);
//         // const checkList = await CheckListService.disableCheckList(id);
//         // const checkList = await CheckListService.enableCheckList(id);

//         res.status(200).json({
//             ok: true,
//             // check: checkList
//         });
//     } catch (error) {
//         res.status(error.status).json({
//             ok: false,
//             message: error.message,
//             errors: error.errors
//         });
//     }
// }

async function getProcessIdClient(req, res, next) {
    try {
        const id = req.params.id;
        const user = req.user

        const process = await Process.findOne({ _id: id, client: user.client }, { 'client': 1 }).populate([{ path: 'client', select: '-active -createdAt -updatedAt -__v' }]);

        if (!process) {
            return res.status(404).json({
                data: {
                    ok: true,
                    messages: 'Process doesn\'t exist'
                }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Load client to process',
            process,
            client: process.client
        })
    } catch (error) {
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }
}

async function createFormProcess(req, res, next) {
    try {
        const id_process = req.params.id;
        const body = req.body;

        const process = await Process.findOne({ _id: id_process }).populate([{ path: 'client' }, { path: 'visa_category' }]);

        await ClientServices.editClient(process.client._id, body);

        const form = await FormServices.createForm(process, body);

        process.status = 'FORM';

        await process.save();

        res.status(200).json({
            ok: true,
            message: `Estamos en la creacion del formulario asociado`,
            // id_process,
            // process,
            // body,
            form
        })
    } catch (error) {
        res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }
}

async function getProcessIdForm(req, res, next) {
    try {
        const id = req.params.id;

        const process = await Process.findOne({ _id: id }).populate([{ path: 'client' }, { path: 'visa_category' }]);

        if (!process) {
            return res.status(404).json({
                data: {
                    ok: false,
                    messages: 'Process references doesn\'t exist'
                }
            });
        }

        const form = await FormServices.getFormByProcess(process);

        if (!form) {
            return res.status(404).json({
                data: {
                    ok: false,
                    messages: 'Form doesn\'t exist'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            message: `Estamos en la carga del formulario asociado`,
            // process,
            form
        })
    } catch (error) {
        return res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
    }
}

async function editProcessIdForm(req, res, next) {
    try {
        const id_process = req.params.id;
        const id_form = req.body._id;
        const body = req.body;

        const process = await Process.findById(id_process).populate([{ path: 'client' }]);

        await ClientServices.editClient(process.client._id, body);

        const form = await FormServices.editForm(process, body);

        return res.status(200).json({
            data: {
                ok: true,
                messages: 'Edit form',
                id_process,
                id_form,
                body,
                process,
                form,
            }
        });
    } catch (error) {
        return res.status(error.status).json({
            ok: false,
            message: error.message,
            errors: error.errors
        });
        // return res.status(500).json({
        //     ok: false,
        //     message: 'error en la actualizacion de informacion del form',
        //     errors: error
        // });
    }

}

// async function putProcessIdConsultant(req, res, next) {
//     try {
//         const id = req.params.id;

//         const process = await Process.findOne({ _id: id }).populate([{ path: 'client' }, { path: 'visa_category' }]);

//         const form = await FormServices.getFormByProcess(process);

//         res.status(200).json({
//             ok: true,
//             message: `Estamos en la carga del formulario asociado`,
//             // process,
//             form
//         })
//     } catch (error) {
//         res.status(error.status).json({
//             ok: false,
//             message: error.message,
//             errors: error.errors
//         });
//     }
// }

module.exports = {
    getProcess,
    getProcessId,
    createProcess,
    editProcess,
    // deleteProcess,
    getProcessIdClient,
    createFormProcess,
    editProcessIdForm,
    getProcessIdForm,
}




/**
 * Para revisar y ver que sirve despues de crear los nuevos servicios
 */

// // metodo cargar todos los procesos del usuario
// function getProcesses(req, res, next) {
//     var user = req.user || 'no hay usuario';

//     Process.find({ user: user._id }, '_id type_visa active status')
//         //.populate({ path: 'user', select: '_id first_name last_name email' })
//         .exec((err, processes) => {
//             if (err) {
//                 return res.status(500).json({
//                     data: {
//                         ok: false,
//                         message: 'Fallo al cargar el proceso',
//                         err
//                     }
//                 });
//             }

//             return res.status(200).json({
//                 data: {
//                     ok: true,
//                     message: 'llegamos a los proceso',
//                     // user,
//                     processes
//                 }
//             });

//         });
// }

// // metodo para cargar un proceso por ID de usuario
// function getProcessId(req, res, next) {
//     var id = req.params.id || 'no llego';
//     var user = req.user || 'no hay usuario';

//     Process.findOne({ _id: id, user: user._id }, '_id type_visa active status')
//         //.populate({ path: 'user', select: '_id first_name last_name email' })
//         .exec((err, process) => {
//             if (err) {
//                 return res.status(500).json({
//                     data: {
//                         ok: false,
//                         message: 'Fallo al cargar el proceso',
//                         err
//                     }
//                 });
//             }

//             if (!process) {
//                 return res.status(401).json({
//                     data: {
//                         ok: false,
//                         message: 'No puede acceder a ese proceso'
//                     }
//                 });
//             }


//             return res.status(200).json({
//                 data: {
//                     ok: true,
//                     message: 'llegamos al proceso',
//                     // id,
//                     process
//                 }
//             });

//         });
// }

// // metodo para cargar un proceso por Id de proceso
// function getFormProcess(req, res, next) {
//     var id = req.params.id;
//     var user = req.user;

//     FormVisitor.findOne({ process: id }).exec((err, form) => {
//         if (err) {
//             return res.status(500).json({
//                 data: {
//                     ok: false,
//                     message: 'Error al cargar el formulario por el proceso',
//                     errors: err
//                 }
//             });
//         }

//         return res.status(200).json({
//             data: {
//                 ok: true,
//                 message: 'Cargando el fomrulario por el proceso',
//                 form
//             }
//         });
//     });

// }

// // metodo apra cargar los proceso para asignar
// function getProcessToAssignan(req, res, next) {

//     // Process.find({ active: true, status: 'FORM' })
//     Process.find({ active: true, status: 'FORM', consultan: { $eq: null } })
//         // .populate({ path: 'client', select: '_id first_name last_name email' })
//         .populate({ path: 'user', select: '_id first_name last_name email' })
//         // .populate({ path: 'consultan' })
//         .exec((err, processes) => {
//             if (err) {
//                 return res.status(500).json({
//                     data: {
//                         ok: false,
//                         message: 'Problemas la carga de procesos',
//                         errors: err
//                     }
//                 });
//             }

//             return res.status(200).json({
//                 data: {
//                     ok: true,
//                     message: 'procesos cargados con exito',
//                     processes
//                 }
//             });
//         });
// }

// // metodo para asignar un proceso a un consultor
// function setAssignConsultan(req, res, next) {
//     var body = req.body;
//     var user = req.user;

//     Process.findById(body._id).exec((err, process) => {
//         if (err) {
//             return res.status(500).json({
//                 data: {
//                     ok: true,
//                     message: 'error al cargar proceso',
//                     errors: err
//                 }
//             });
//         }

//         if (!process) {
//             return res.status(400).json({
//                 data: {
//                     ok: true,
//                     message: 'no existe el proceso'
//                 }
//             });
//         }

//         if (process.status !== 'FORM' || process.hasOwnProperty('consultan')) {
//             return res.status(401).json({
//                 data: {
//                     ok: true,
//                     message: 'El proceso ya fue asignado'
//                 }
//             });
//         }

//         process.consultan = body.consultan;

//         process.save((err, saveProcess) => {
//             if (err) {
//                 return res.status(500).json({
//                     data: {
//                         ok: true,
//                         message: 'error al actualizar el proceso',
//                         errors: err
//                     }
//                 });
//             }

//             return res.status(200).json({
//                 data: {
//                     ok: true,
//                     message: 'llegamos aqui',
//                     process: saveProcess
//                 }
//             });

//         });
//     });


// }

// // metodo para consultar los procesos asignados a un consultor
// function getProcessesAssigned(req, res, next) {
//     const user = req.user;
//     const id = user._id;

//     Process.find({ active: true, status: 'FORM', consultan: id }).exec((err, processes) => {
//         if (err) {
//             return res.status(500).json({
//                 data: {
//                     ok: false,
//                     message: 'Error al cargar los procesos',
//                     errors: err
//                 }
//             });
//         }

//         return res.status(200).json({
//             data: {
//                 ok: true,
//                 message: 'Llegamos a los procesos asignados',
//                 processes
//             }
//         })
//     });



// }

// // Metodo que guarda un formulario VISITOR
// function saveForm(req, res, next) {
//     var body = req.body;
//     var user = req.user;

//     body.user = user._id;

//     frmVisitor = new FormVisitor(body);

//     Process.findById(body.process).exec((err, process) => {
//         if (err) {
//             return res.status(500).json({
//                 data: {
//                     ok: false,
//                     message: 'Problemas con encontrar el proceso asociado',
//                     errors: err
//                 }
//             });
//         }

//         if (!process) {
//             return res.status(400).json({
//                 data: {
//                     ok: false,
//                     message: 'No se encuentra el proceso asociado con ese ID',
//                 }
//             });
//         }

//         process.status = 'FORM';

//         process.save((err, saveProcess) => {
//             if (err) {
//                 return res.status(500).json({
//                     data: {
//                         ok: false,
//                         message: 'No se puede actualizar el proceso',
//                         errors: err
//                     }
//                 });
//             }

//             frmVisitor.save((err, saveForm) => {
//                 if (err) {
//                     return res.status(500).json({
//                         data: {
//                             ok: false,
//                             message: 'No se puede guardar el formulario',
//                             errors: err
//                         }
//                     });
//                 }

//                 return res.status(200).json({
//                     data: {
//                         ok: true,
//                         form: saveForm,
//                         user,
//                     }
//                 });
//             });

//         });
//     });
// }

// // metodo para la creacion de una solicitud y el proceso respectivo
// // se crea el proceso con el usuario asociado
// function createProcess(req, res, next) {
//     var body = req.body;

//     User.findOne({ email: body.email }, campos).exec((err, userDB) => {
//         // manejo de error de la peticion
//         if (err) {
//             return res.status(500).json({
//                 data: {
//                     ok: false,
//                     mensaje: 'Error al buscar usuario',
//                     errors: err
//                 }
//             });
//         }

//         if (userDB) {

//             Process.find({ user: userDB._id, type_visa: body.visa, active: true }).exec((err, processBD) => {
//                 if (err) {
//                     return res.status(500).json({
//                         data: {
//                             ok: false,
//                             mensaje: 'Error al buscar proceso',
//                             errors: err
//                         }
//                     });
//                 }

//                 console.log(processBD);
//                 if (processBD.length > 0) {
//                     return res.status(200).json({
//                         data: {
//                             ok: false,
//                             mensaje: 'El usuario tiene uno o mas proceso activo'
//                         }
//                     });
//                 }

//                 // crear proceso pagado
//                 saveProcess(userDB, body.visa)
//                     .then((response) => {
//                         res.status(response.status).json({ data: response.data })
//                     })
//                     .catch((response) => {
//                         res.status(response.status).json({ data: response.data });
//                     });
//             });


//         } else {
//             // el usuario no existe y debe ser creado

//             var nUser = new User();

//             nUser.first_name = body.first_name;
//             nUser.last_name = body.last_name;
//             nUser.email = body.email;
//             nUser.password = body.password;

//             nUser.save((err, userSave) => {

//                 if (err) {
//                     return res.status(500).json({
//                         ok: false,
//                         mensaje: 'Error al guardar usuario',
//                         errors: err
//                     });
//                 }

//                 saveProcess(userSave, body.visa)
//                     .then((response) => {
//                         res.status(response.status).json({ data: response.data })
//                     })
//                     .catch((response) => {
//                         res.status(response.status).json({ data: response.data });
//                     });

//             });
//         }

//     });
// }

// // metodo para crear un proceso con su usuario asociado
// function saveProcess(user, visa) {
//     const process = new Promise((resolve, reject) => {
//         try {

//             var process = new Process({
//                 user: user._id,
//                 type_visa: visa
//             });

//             process.save((err, saveProcess) => {
//                 if (err) {
//                     reject({
//                         status: 500,
//                         data: {
//                             ok: false,
//                             mensaje: 'Error al crear el proceso',
//                             errors: err
//                         }
//                     });
//                 }

//                 resolve({
//                     status: 200,
//                     data: {
//                         ok: true,
//                         user: user,
//                         process: saveProcess
//                     }
//                 });
//             });

//         } catch (error) {
//             reject({
//                 status: 500,
//                 message: 'Error al crear el proceso',
//                 errors: error
//             });
//         }
//     });

//     return process;
// }

// module.exports = {
//     createProcess,
//     saveForm,
//     getProcesses,
//     getProcessId,
//     getFormProcess,
//     getProcessToAssignan,
//     setAssignConsultan,
//     getProcessesAssigned,
// }