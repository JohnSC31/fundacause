const mongoose = require('mongoose');

const esquemaProyecto = mongoose.Schema({
    correoResponsable: {
        type: String,
        required: true
    },
    pName: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    objetivoF: {
        type: String, 
        required: true
    },
    montoReca: {
        type: String, 
        required: true
    },
    fechaLimite: {
        type: String, 
        required: true
    },
    categoriaP: {
        type: String,
        required: true
    },
    mediaItems: {
        type: [String], 
        required: true
    },
    donaciones: {
        type: [String], 
        required: true
    }, 
    estado: {
        type: String,
        required: true
    },
    validaciones:{  //poner como algo interno avalidaciones, mas atributos tipo usuario positiva o negativa
        type: [String],
        required: false
    },
    

});

module.exports = mongoose.model('proyecto', esquemaProyecto);
