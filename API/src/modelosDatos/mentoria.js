const mongoose = require('mongoose');

const esquemaMentoria = mongoose.Schema({
    correoMentor: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: String, 
        required: true
    },
    correoUsuarios: {
        type: [String], 
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    pagoRealizado:
    {
        type: Boolean,
        required: true
    },
    montoPagado:{
        type: String,
        required: true
    }, 
    estado: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Mentoria', esquemaMentoria);
