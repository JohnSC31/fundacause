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
    precioEntrada: {
        type: String, 
        required: true
    },
    participantes: {
        //que se incluya la informacion del usuario como varias caracteristica como correo, monto pagado
        
        
        type: [String], 
        required: true// arreglar con correo y monto pagado
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
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
