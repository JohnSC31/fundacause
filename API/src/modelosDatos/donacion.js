const mongoose = require('mongoose');

const esquemaDonacion = mongoose.Schema({
    
    monto: {
        type: String, 
        required: true
    },
    correoDonante: {
        type: String,
        required: true
    },
    nombreDonante: {
        type: String,
        required: true
    },
    telefonoDonante: {
        type: String,
        required: true
    },
    proyectoId: {
        type: String,
        required: true
    },
    nombreProyecto: {
        type: String,
        required: true
    },
    fechaDonacion: {
        type: Date, 
        required: true
    },
    comentario: {
        type: String
    }
});

module.exports = mongoose.model('donacion', esquemaDonacion);
