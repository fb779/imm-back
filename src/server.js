require('dotenv').config();

const config = require('./config/config');

const mongoose = require('mongoose');

const app = require('./app');

mongoose.connect(config.db_url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(db => {
        console.log(`Base de datos OK!`)

        /********************************************************
         *  Server listenning
         ********************************************************/

        app.listen(app.get('port'), () => {
            console.log(`API listening on port ${ app.get('port') }!`);
        });

    })
    .catch(err => {
        console.error.bind(console, 'connection error:')
    });