const mongoose = require('mongoose');

const esquemaUsuario = mongoose.Schema({
    
    cedula: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    areaTrabajo: {
        type: String,
        required: true
    },
    dineroInicial: {
        type: Number,
        required: true
    },
    telefono: {
        type: String, 
        required: true
    },
    rol: {
        type: String,
        required: false
    },
    contrasenna: {
        type: String,
        required: true
    },
    proyectoPropios: {
        type: [String],
        required: false
    },
    donaciones: {
        type: [String],
        required: false
    },
    estado: {
        type: String,
        required: true
    },
    mentor:{
        type: String,
        required: false
    }

});

module.exports = mongoose.model('Usuario', esquemaUsuario);
