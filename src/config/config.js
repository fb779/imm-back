/*******************************************
 * Imports
 *******************************************/
const path = require('path');

/*******************************************
 * Definicion de ruta para upload
 *******************************************/
const rootDir = 'public';
const uploadDir = path.join(__dirname, '../public/processes/');
// const uploadDirPhoto = path.join(__dirname, '../public/users/');
const uploadDirPhoto = path.join(__dirname, '..', rootDir, 'users');

/*******************************************
 * Definicion de enum para validaciones
 *******************************************/
const titles = {
  values: ['mr', 'mrs', 'miss', 'ms'],
  message: `{VALUE} isn't a valid type`,
};

const sexs = {
  values: ['1', '2'],
  message: `{VALUE} isn't a valid type`,
};

const typeVisa = {
  values: ['VISITOR', 'TURIST', 'STUDY'],
  message: '{VALUE} is not valid',
};

const statusVisa = {
  values: ['ACTIVE', 'FORM', 'ASIGNED', 'VALID', 'CLOSE'],
  message: `{VALUE} isn't a valid status `,
};

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE', 'CLIENT_ROLE'],
  message: `{VALUE} doesn't a role valid`,
};

const relationships = {
  values: ['SPOUSE', 'PARTNER', 'CHILDREN'],
  message: `{VALUE} doesn't a kind valid`,
};

const statusDocument = {
  values: ['CREATE', 'UPLOADED', 'APPROVED', 'REJECTED'],
  message: `{VALUE} isn't a valid status `,
};

const typeFiles = {
  values: ['forms', 'guides'],
  message: `{VALUE} isn't a valid status `,
};

const typeExtensionFiles = {
  values: ['pdf', 'jpeg', 'jpg', 'png'],
  message: `{VALUE} isn't a valid status `,
};

const activateStep = {
  values: ['ACTIVE', 'INACTIVE'],
  message: `{VALUE} isn't a valid status `,
};

const statusStep = {
  values: ['IN-PROGRES', 'COMPLETE'],
  message: `{VALUE} isn't a valid status `,
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

const roles = {
  admin: 'ADMIN_ROLE',
  client: 'CLIENT_ROLE',
  user: 'USER_ROLE',
};

const typesStatusDocument = {
  create: 'CREATE',
  uploaded: 'UPLOADED',
  approved: 'APPROVED',
  rejected: 'REJECTED',
};

const valuesActivateStep = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

const valuesStatusStep = {
  inprogres: 'IN-PROGRES',
  complete: 'COMPLETE',
};

const formats = {
  input: 'ddd MMM DD YYYY HH:mm:ss Z',
  output: 'YYYY-MM-DD',
};

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
/*******************************************
 * Exports de los datos
 *******************************************/

module.exports = {
  port: process.env.SER_PORT || 3001,
  seed: process.env.SEED,
  reset_seed: process.env.REST_SEED,
  url_frontend: process.env.URL_FRONTEND,
  db_url: process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  rootDir,
  uploadDir,
  uploadDirPhoto,
  statusVisa,
  typeVisa,
  rolesValidos,
  roles,
  titles,
  sexs,
  relationships,
  statusDocument,
  typeFiles,
  typeFilesUpload,
  typeExtensionFiles,
  typesDocument,
  typesStatusDocument,
  activateStep,
  valuesActivateStep,
  statusStep,
  valuesStatusStep,
  formats,
  passwordRegex,
};
