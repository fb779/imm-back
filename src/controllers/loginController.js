/************************************************
 *  Importaciones
 ************************************************/
const User = require('./../model/user.model');
const authSer = require('./../services/auth.services')

/**
 * Function to login user in app
 */
function signin(req, res, next) {
    const body = req.body;
    console.log('login body', req.body);

    User.findOne({ email: body.email }).exec((err, user) => {
        if (err) {
            return res.status(500).json({
                data: {
                    ok: false,
                    message: 'Error al buscar usuario',
                    errors: [err]
                },
            });
        }

        if (!user) {
            return res.status(400).json({
                data: {
                    ok: false,
                    // messages: 'Credenciales incorrectas, usuario o password errados',
                    errors: [
                        'The credentials are incorrect, email or password has error'
                    ],
                    // msa: 'email',
                }
            });
        }

        // validacion de verificacion del password para generar el token
        if (!user.verifyPassword(body.password)) {
            return res.status(400).json({
                data: {
                    ok: false,
                    // messages: 'Credenciales incorrectas, usuario o password errados',
                    errors: [
                        'The credentials are incorrect, email or password has error'
                    ],
                    // msa: 'password',
                },
            });
        }

        return res.status(200).json({
            data: {
                ok: true,
                // user,
                token: authSer.createToken(user),
                // id: user._id,
                message: 'signin'
            },
        });

    });
}

/**
 * Function to register a new user
 */
function signup(req, res, next) {
    var body = req.body;
    // console.log('register body', req.body);

    var newUser = new User({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: body.password,
    });

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
                message: 'Create User',
                user
            }
        });
    });
}

/**
 * Function to log out user
 */
function signout(req, res, next) {
    return res.status(200).json({
        data: {
            ok: true,
            errors: [
                'not work'
            ],
            message: 'signout'
        }
    });
}

/**
 * Exports function to login
 */
module.exports = {
    signin,
    signup,
    signout
}