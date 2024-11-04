const mongoose = require('mongoose');

const esquemaEvento = mongoose.Schema({
    correoHost: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    participantes: {
        type: [String], 
        required: true
    },
    fechaHora: {
        type: Date,
        required: true
    },
    
    modalidad:{
        type: String,
        required: true
    },
    materiales:{
        type: String,
        required: true
    }
    

});

module.exports = mongoose.model('Evento', esquemaEvento);
