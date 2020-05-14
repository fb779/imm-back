const mongoose = require('mongoose');

const config = require('./../config/config');

mongoose.connect(config.db_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

module.exports = mongoose;