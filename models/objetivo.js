var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var statusValids = {
    values: ['NUEVO', 'FOTO', 'ELIMINADO'],
    message: '{VALUE} no es un estado permitido'
}

var objetivoSchema = new Schema({
    titulo: { type: String },
    estado: { type: String, required:true, default: 'NUEVO', enum: statusValids },
    imagenes: [{type: Schema.Types.ObjectId, ref: 'Imagen'}],
    geo: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { collection: 'objetivos'});


module.exports = mongoose.model('Objetivo', objetivoSchema);