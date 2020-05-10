/*******************************************
 * Imports
 *******************************************/
const path = require('path');

/*******************************************
 * Definicion de ruta para upload
 *******************************************/
const uploadDir = path.join(__dirname, '../public/processes/');

/*******************************************
 * Definicion de enum para validaciones
 *******************************************/
const titles = {
    values: ['mr', 'mrs', 'miss', 'ms'],
    message: '{VALUE} no es un tipo permitido'
};

const sexs = {
    values: ['1', '2'],
    message: '{VALUE} no es un tipo permitido'
};

const typeVisa = {
    values: ['VISITOR', 'TURIST', 'STUDY'],
    message: '{VALUE} is not valid'
};

const statusVisa = {
    values: ['ACTIVE', 'FORM', 'ASIGNED', 'VALID', 'CLOSE'],
    message: `{VALUE} isn't a valid status `
};

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'CLIENT_ROLE'],
    message: `{VALUE} doesn't a role valid`
};

const relationships = {
    values: ["SPOUSE", "PARTNER", "CHILDREN"],
    message: `{VALUE} doesn't a kind valid`
};

const statusDocument = {
    values: ['CREATE', 'UPLOADED', 'APPROVED', 'REJECTED'],
    message: `{VALUE} isn't a valid status `
};

const typeFiles = {
    values: ['forms', 'guides'],
    message: `{VALUE} isn't a valid status `
};

const typeExtensionFiles = {
    values: ['pdf', 'jpeg', 'jpg', 'png', ],
    message: `{VALUE} isn't a valid status `
};


/*******************************************
 * Definicion objetos constantes
 *******************************************/
const typeFilesUpload = {
    forms: 'forms',
    guides: 'guides',
    documents: 'documents',
};

const typesDocument = {
    client: 'client',
    process: 'process',
};

/*******************************************
 * Exports de los datos
 *******************************************/

module.exports = {
    port: process.env.SER_PORT || 3001,
    seed: process.env.SEED,
    db_url: process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    uploadDir,
    statusVisa,
    typeVisa,
    rolesValidos,
    titles,
    sexs,
    relationships,
    statusDocument,
    typeFiles,
    typeFilesUpload,
    typeExtensionFiles,
    typesDocument
};