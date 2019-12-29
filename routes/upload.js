var express = require('express');
const ImagenModel = require('../models/imagen');
const ObjetivoModel = require('../models/objetivo');
const mongoose = require('mongoose');
var fileUpload = require('express-fileupload');
const logger = require('../logger/logger')
const app = express();
const mdUploadValidator = require('../middlewares/upload-validator');

app.use(fileUpload());

/**
 * Parametros
 */
const extensionesImagen = ['png', 'jpg', 'jpeg', 'gif'];
const extensionesMetadata = ['json'];


/**
 * Upload imagen
 */
app.post('/',  (req, res, next) => {

    if( !req.files ){
        return res.status(400).json({
            codigo: `NO_FILE`,
            descripcion: `No se encontraron archivos`
        });
    }

    var objetivoId = req.body.objetivoId;
    console.log('Subiendo archivo para id:', objetivoId);
    
    // Obtener nombre de archivo
    const archivo = req.files.imagen;
    logger.info(`Archivo recibido: ${archivo.name}` );
    logger.info(`Size: ${archivo.size}`);
    logger.info(`Mimetype: ${archivo.mimetype}`);

    const metadata = req.body.metadata;
    console.log('Metadata: ', metadata);
    

    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    // Validar extension imagen
    if(extensionesImagen.indexOf( extensionArchivo ) < 0) {
        return res.status(400).json({
            codigo: `INVALID_FILE`,
            descripcion: `Extension de archivo no valida. Solamente ${extensionesImagen.join(', ')}`
        });
    }

    // Validar formato de objetivoId
    if( !mongoose.Types.ObjectId.isValid(objetivoId) ) {
        return res.status(400).json({
            codigo: `INVALID_ID`,
            descripcion: `Formato de objetivoId: ${objetivoId} incorrecto`,
            errors: null
        });
    }

    // Buscar objetivo por id en base de datos
    logger.info(`Buscando objetivo ${objetivoId} en BD...`);
    ObjetivoModel.findById(objetivoId, (err, objetivo) => {
        
        if (err) {
            logger.error(`Error al buscar en BD objetivoId: ${objetivoId}`, err);
            return res.status(500).json({
                codigo: `INTERNAL_DB_ERROR`,
                descripcion: `Error al buscar en BD objetivoId: ${objetivoId}`,
                errors: err
            });
        }

        /**
         * ObjetivoId no encontrado
         * evaluar posibilidad de guardar la imagen como no clasificado
         */
        if (!objetivo) {
            return res.status(400).json({
                codigo: `INVALID_DATA_ID`,
                descripcion: `objetivoId: ${objetivoId} no encontrado`,
                errors: null
            });
        }
        logger.info(`objetivo encontrado ${objetivoId}`);
        
        const imagen = new ImagenModel();
        const nombreArchivo = `${imagen._id}.${extensionArchivo}`;

        // Atributos de imagen
        imagen.filename = nombreArchivo;
        // imagen.metadata = metadata;
        imagen.objetivo = objetivoId;

        // Mover archivo
        const path = `./uploads/${nombreArchivo}`;

        logger.info(`Guardando archivo ${path}`);
        archivo.mv( path, err => {
            if (err) {
                return res.status(500).json({
                    codigo: `INTERNAL_FS_ERROR`,
                    descripcion: `Error al mover archivo`,
                    errors: err
                });
            }
            
            logger.info(`Guardando imagen ${imagen._id}`);

            objetivo.imagenes.push(imagen);
            objetivo.save((err, obj) => {

                if (err) {
                    return res.status(500).json({
                        codigo: `INTERNAL_FS_ERROR`,
                        descripcion: `Error al mover archivo`,
                        errors: err
                    });
                }

                // console.log(obj);
                // return res.status(200).json(obj);
                imagen.save((err, img) => {

                    if (err) {
                        return res.status(500).json({
                            codigo: `INTERNAL_DB_ERROR`,
                            descripcion: `Error al guardar imagen en BD`,
                            errors: err
                        });
                    }


                    return res.status(200).json();
                });
            });
            // imagen.save((err, img) => {
                
            //     if (err) {
            //         return res.status(500).json({
            //             codigo: `INTERNAL_DB_ERROR`,
            //             descripcion: `Error al guardar imagen en BD`,
            //             errors: err
            //         });
            //     }
                
                
            //     return res.status(200).json(img);
            // });

        });
    });
});


module.exports = app;