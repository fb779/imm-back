const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const seed = require('../config/config').seed;

const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'CLIENT_ROLE'],
    message: '{VALUE} no es un role permitido'
};

const UserSchema = new Schema({
    first_name: { type: String, required: [true, 'El Nombre es necesario'], },
    last_name: { type: String, required: [true, 'El Apellido es necesario'], },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'], lowercase: true },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false, default: '' },
    role: { type: String, default: 'CLIENT_ROLE', enum: rolesValidos, uppercase: true },
    active: { type: Boolean, default: false },
    // google: { type: Boolean, default: false },
}, { timestamps: true, collection: 'users' });

UserSchema.plugin(uniqueValidator, { message: '{PATH} isnt unique' });

/**
 * Hook to before to save user to encrypt password
 */
UserSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = await this.encryptPassword(user.password);
    return next();
});

/**
 * Hook to after save user to replace the password
 */
UserSchema.post('save', async function(next) {
    const user = this;
    user.password = ':)';

    return next;
});

/**
 * method of encript password
 */
UserSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

// /**
//  * method to verify password
//  **/
UserSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);

};

module.exports = mongoose.model('User', UserSchema);