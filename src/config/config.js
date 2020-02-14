module.exports = {
    port: process.env.SER_PORT || 3001,
    seed: process.env.SEED,
    db_url: process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};