var express = require('express');
var app = express();
const mongoose = require('mongoose');
const ImagenModel = require('../models/imagen');
const ObjetivoModel = require('../models/objetivo');
const logger = require('../logger/logger');


/**
 * Obtener todos las imagenes
 */
app.get('/', (req, res, next) => {

    const objetivoId = req.query.objetivoId || null;
    logger.http(`Buscando imagenes para objetivoId: ${objetivoId}`);

    var queryObject = { };

    // Si el parametro es valido ingresar a la consulta
    if(mongoose.Types.ObjectId.isValid(objetivoId)) {
        queryObject.objetivo = objetivoId;
    }

    ImagenModel.find( queryObject )
        .exec((err, imagenes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando imagenes desde BD',
                    errors: err
                })
            }
            res.status(200).json(imagenes);
        });
});


/**
 * Obtener imagen por imagenId
 */
app.get('/:imagenId', (req, res, next) => {

    const imagenId = req.params.imagenId;

    ImagenModel.findOne({_id: imagenId })
        // .populate('objetivo')
        .exec((err, imagen) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando imagenes desde BD',
                    errors: err
                })
            }
            res.status(200).json(imagen);
        });
});


/**
 * Eliminar imagen por imagenId
 */
app.delete('/:imagenId', (req, res, next) => {

    const imagenId = req.params.imagenId;

    logger.http(`Eliminar imagen por id: ${imagenId}`);

    ImagenModel.findByIdAndRemove(imagenId, ( err, imagenBorrada ) => {

        if (err) {
            logger.error('Error eliminando imagen desde BD', err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error eliminando imagen desde BD',
                errors: err
            })
        }

        if(!imagenBorrada) {
            logger.info(`No existe la imagen ${imagenId}`)
            return res.status(400).json({
                ok: false,
                mensaje: `No existe la imagen ${imagenId}`,
                errors: ''
            })
        }

        ObjetivoModel.findById(imagenBorrada.objetivo, (err, objetivo) => {
            
            if (err) {
                return res.status(500).json(error);
            }


            console.log(objetivo);
            if(objetivo) {
                objetivo.imagenes.pop(imagenBorrada._id);
            }
            

            logger.info(`Imagen: ${imagenBorrada} eliminada Ok`);
            return res.status(200).json();
        });



    });

});



module.exports = app;