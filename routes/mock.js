var express = require('express');
var app = express();
var Objetivo = require('../models/objetivo')
var faker = require('faker');
faker.locale = "es";

// Rutas
app.post('/objetivos', (req, res, next) => {
    
    console.log('Creando objetivos mock');

    var objetivo = new Objetivo()
    objetivo.titulo = faker.name.findName();
    objetivo.estado = 'NUEVO';
    objetivo.cantImagenes = Math.floor(Math.random() * 20)
    objetivo.geo = {
        "type": "Point",
        // "coordinates": [
        //   faker.address.latitude(),
        //   faker.address.latitude()
        // ]
        "coordinates": [
            -58.379716873168945 + (Math.random()-0.5) / 100,
            -34.60523684562201 + (Math.random()-0.5) / 100
          ]
      }
    console.log('objetivo mock: ', objetivo);
    
    objetivo.save( (err, objSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear objetivo',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            objetivo: objSaved
        });
    })

});

module.exports = app;