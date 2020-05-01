const User = require('../model/user.model');
const Process = require('../model/proceso.model');
const FormVisitor = require('../model/form-visitor.model');


// metodo para cargar los procesos asignados a un consultor
function getConsultantProcesses(req, res, next) {
    var user = req.user;

    Process.find({ consultan: user._id })
        .populate({ path: 'user', select: '_id first_name last_name email' })
        .exec((err, listProcess) => {
            if (err) {
                errorHandler(err, res);
                // res.status(500).json({
                //     data: {
                //         ok: false,
                //         message: 'error al cargar los procesos',
                //     }
                // });
            }

            res.status(200).json({
                data: {
                    ok: true,
                    // message: 'llegamos a los procesos asignados al consultor',
                    processess: listProcess
                }
            });
        });


}

async function getInformationProcess(req, res, next) {
    try {
        var id_process = req.params.id_process;

        let process = await Process.findById(id_process)
            // .populate({ path: 'user', select: '_id first_name last_name email' });

        let form = await FormVisitor.findOne({ process: id_process });

        res.status(200).json({
            data: {
                ok: true,
                // message: 'llegamos a los procesos asignados al consultor',
                processess: process,
                form
            }
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
    getConsultantProcesses,
    getInformationProcess,
}