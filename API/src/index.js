#!/usr/bin/env node

const express = require('express');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



// URL de la BD
const MONGODB_URI = 'mongodb+srv://reque:proyecto123@cluster0.2gxrrzt.mongodb.net/'

const app = express();
const port = process.env.PORT || 9000;
app.use(cors()); 

const rutasUsuario = require('./endpoints/usuarios');
const rutasProyecto = require('./endpoints/proyecto');
const rutasDonacion = require('./endpoints/donaciones');

// middlewares

//para permitir que el servidor reciba peticiones de otros servidores
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');


    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');


    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(express.json()); // para que el servidor entienda json

app.use('/api', rutasUsuario ); // ruta para los usuarios

app.use('/api', rutasProyecto ); // ruta para los proyectos

app.use('/api', rutasDonacion ); // ruta para las tareas

// rutas
app.get('/', (req, res) => {
    res.send('Bienvenidos');
});

// Conexión a la base de datos
mongoose.connect(MONGODB_URI).then(() => console.log('Base de datos conectada')).catch((error)=> console.log(error));

app.listen(port, () => console.log('Server is running', port));
