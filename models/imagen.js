var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imagenSchema = new Schema({
    filename: { type: String, required: true },
    objetivo: { type: Schema.Types.ObjectId, ref:'Objetivo' },
    metadata: { any: {}  },
}, { collection: 'imagenes'});


module.exports = mongoose.model('Imagen', imagenSchema);