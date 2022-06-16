const mongoose = require('mongoose'); // mongose connect to mongodb data base
// const validator = require('validator');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, // useCreateIndex is used to be sure that mongoose and mongodb indexes are crated and allow us quilcly to access the database
    useFindAndModify: false,
});





