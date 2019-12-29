// Requieres
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const logger = require('./logger/logger');
var expressWinston = require('express-winston');


/**
 * Parametros
 */
const mongoUri = 'mongodb://localhost:27017/saigDB';

// Iniciializar variables
var app = express();

// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// app.use(expressWinston.logger(logger));


// Routes
const appRoutes = require('./routes/app');
const objetivoRoutes = require('./routes/objetivo');
const imagenRoutes = require('./routes/imagen');
const uploadRoutes = require('./routes/upload');
const mockRoutes = require('./routes/mock');

// Base de datos
mongoose.connection.openUri(mongoUri, ( err , res )=> {
    if( err ) throw err;
    logger.info(`Base de datos online on ${mongoUri}`)
});


// Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'))


// parse application/json
app.use(bodyParser.json())


// Routes
app.use('/', appRoutes);
app.use('/objetivos', objetivoRoutes);
app.use('/imagenes', imagenRoutes);
app.use('/upload', uploadRoutes);
app.use('/mock', mockRoutes);



// Server start
app.listen(3000, () => {
    
    logger.info('Express server puerto 3000 online');
    
});