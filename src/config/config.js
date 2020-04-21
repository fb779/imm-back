const titles = {
    values: ['mr', 'mrs', 'miss', 'ms'],
    message: '{VALUE} no es un tipo permitido'
};

const sexs = {
    values: ['1', '2'],
    message: '{VALUE} no es un tipo permitido'
};

const typeVisa = {
    values: ['TURIST', 'VISITOR'],
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

module.exports = {
    port: process.env.SER_PORT || 3001,
    seed: process.env.SEED,
    db_url: process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    statusVisa: statusVisa,
    typeVisa: typeVisa,
    rolesValidos: rolesValidos,
    titles,
    sexs,
    relationships,


};