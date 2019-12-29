var express = require('express');
var app = express();
var Objetivo = require('../models/objetivo');
const logger = require('../logger/logger');



/**
 * Obtener todos los objetivos
 */
app.get('/', (req, res, next) => {

    Objetivo.find({})
        .populate('imagenes')
        .exec((err, objetivos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando objetivos desde BD',
                    errors: err
                })
            }

            res.status(200).json(objetivos);

        });
});

/**
 * Obtener objetivo por objetivoId
 */
app.get('/:objetivoId', (req, res, next) => {

    const objetivoId = req.params.objetivoId;

    Objetivo
        .findOne({ _id: objetivoId })
        .populate('imagenes')
        .exec((err, objetivo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando objetivos desde BD',
                    errors: err
                })
            }

            return res.status(200).json(objetivo);
        })

});



/**
 * Crear nuevo objetivo
 */
app.post('/', (req, res, next) => {
    
    var objetivoRequest = req.body;
    
    console.log('objetivo a guardar: ', objetivoRequest)
    var objetivo = new Objetivo()

    objetivo.geo = objetivoRequest.geo;
    objetivo.estado = 'NUEVO';
    objetivo.titulo = objetivoRequest.titulo;

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

/**
 * 
 */
app.delete('/:objetivoId', (req, res, next) => {

    const objetivoId = req.params.objetivoId;

    Objetivo.findByIdAndRemove(objetivoId, ( err, objetivoEliminado ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error eliminado objetivo desde BD',
                errors: err
            })
        }
        if(!objetivoEliminado) {
            logger.info(`No existe el objetivo ${objetivoId}`)
            return res.status(400).json({
                ok: false,
                mensaje: `No existe el objetivo ${objetivoId}`,
                errors: ''
            })
        }

        logger.info(`Objetivo: ${objetivoEliminado} eliminado Ok`);
        return res.status(200).json();
    });

});


module.exports = app;