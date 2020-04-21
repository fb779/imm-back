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
                res.status(500).json({
                    data: {
                        ok: false,
                        message: 'error al cargar los procesos',
                    }
                });
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
    var id_process = req.params.id_process;
    // var user = req.user;


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

}


module.exports = {
    getConsultantProcesses,
    getInformationProcess,
}