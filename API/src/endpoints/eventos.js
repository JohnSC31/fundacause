const express = require('express');
const esquemaEvento = require('../modelosDatos/evento');
const Usuario = require('../modelosDatos/usuario');
const { ExplainVerbosity } = require('mongodb');
const moment = require('moment');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const CircularJSON = require('circular-json');

//crear evento
router.post('/eventos', (req, res) => {

    const evento = esquemaEvento(req.body); // Create a new instance of the esquemaEvento model

    evento.save()
        .then(() => { res.json(evento) })
        .catch((error) => res.json(error));



});

//obtener los eventos
router.get('/eventos', (req, res) => {
    esquemaEvento.find()
        .then((eventos) => res.json(eventos))
        .catch((error) => res.json(error));
});


//buscar evento por id
router.get('/eventos/:id', (req, res) => {
    const { id } = req.params;

    esquemaEvento.findById(id)
        .then((eventos) => res.json(eventos))
        .catch((error) => res.json(error));

});


//Cambiar estado a la evento
router.put('/eventos/estado/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const filter = { _id: id };

    esquemaEvento.updateOne(filter, {$set: {estado: estado }})
        .then(() => { res.json({ mensaje: 'Estado de la evento actualizado' }) })
        .catch((err) => res.json(err));
});


// registrar usuario a evento
router.post('/eventos/agregarusuario/:id', (req, res) => {
    const { email } = req.body;
    const { id} = req.params;
    console.log(id);
    console.log(email);
    esquemaEvento.findById(id)
        .then((evento) => { //revisa que el usuario no este ya en el evento
            console.log(evento);
            if (evento.participantes.length > 0) {
                for (let i = 0; i < evento.participantes.length; i++) {
                    if (evento.participantes[i] == email) {
                        return res.status(400).json({ error: "El usuario ya está en la evento" });
                    }
                }
            }
            evento.participantes.push(email);
            evento.save()
                .then(() => res.json({ mensaje: "Usuario agregado a la evento" }))
                .catch((error) => res.json(error));
        })
});




module.exports = router;