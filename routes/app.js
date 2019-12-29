var express = require('express');
var app = express();

// Health ckeck
app.get('/', (req, res, next) => {
    
    res.status(200).json({
        ok: true,
        message: 'Health check endpoint',
        date: new Date()

    });

});

module.exports = app;