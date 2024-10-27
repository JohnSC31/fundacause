const express = require('express');
const esquemaUsuario = require('../modelosDatos/usuario');
const router = express.Router();


//autenticar usuario
router.post('/autenticacion', (req, res) => {
    const { email, contrasenna } = req.body;

    esquemaUsuario.findOne({ email }, (error, usuario) => {
        if (error) {
            res.status(500).send('Error al autentificar el usaurio', error);
        } else {
            if (!usuario) {
                res.status(500).send('El usuario no se ha encontrado');
            } else {
                if (usuario.estado === 'Inactivo') {
                    res.status(500).json({ mensaje: 'Usuario desactivado' });
                } else {
                    if (usuario.contrasenna === contrasenna) {
                        console.log(usuario);
                        res.status(200).json({ mensaje: 'Usuario autenticado' });
                    } else {
                        res.status(500).json({ mensaje: 'Contraseña incorrecta' });
                    }
                }
            }
        }
    })
}); //seleccionamos el campo que queremos traer