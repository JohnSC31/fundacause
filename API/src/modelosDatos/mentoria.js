const mongoose = require('mongoose');

const esquemaMentoria = mongoose.Schema({
    correoMentor: {
        type: String,
        required: true
    },
    nombreMentoria: {
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
    usuariosM: {
        type: [String], 
        required: true
    }
});

module.exports = mongoose.model('Mentoria', esquemaMentoria);
