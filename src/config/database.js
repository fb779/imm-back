const mongoose = require('mongoose');

const config = require('./../config/config');

mongoose.connect(config.db_url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    // .then(db => { console.log(`Base de datos ${process.env.DB_NAME} OK!`) })
    // .catch(err => { console.error.bind(console, 'connection error:') });



// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// var db = mongoose.connection;
// db.on('error', () => { console.error.bind(console, 'connection error:') });
// db.on('open', (err, res) => {
//     if (err) throw err;

//     console.log('Base de datos OK!');
// });


module.exports = mongoose;