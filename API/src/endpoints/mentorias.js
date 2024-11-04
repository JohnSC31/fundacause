const express = require('express');
const esquemaMentoria = require('../modelosDatos/mentoria');
const Usuario = require('../modelosDatos/usuario');
const { ExplainVerbosity } = require('mongodb');
const moment = require('moment');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const CircularJSON = require('circular-json');

//crear mentoria
router.post('/mentorias', (req, res) => {

    const mentoria = esquemaMentoria(req.body); // Create a new instance of the esquemaMentoria model

    mentoria.save()
        .then(() => { res.json(mentoria) })
        .catch((error) => res.json(error));



});

//obtener los mentorias
router.get('/mentorias', (req, res) => {
    esquemaMentoria.find()
        .then((mentorias) => res.json(mentorias))
        .catch((error) => res.json(error));
});

//obtener lista de los Id de los mentorias
router.get('/mentoriasId', (req, res) => {
    let ids_proyec = [];

    esquemaMentoria.find()
        .select("id")
        .exec()
        .then((idsmentoria) => {
            for (let i = 0; i < idsmentoria.length; i++) {
                ids_proyec.push(idsmentoria[i].id);
            }
            res.json({ Ids: ids_proyec });
        })
        .catch((error) => res.json(error));
});

//buscar mentoria por id
router.get('/mentorias/:id', (req, res) => {
    const { id } = req.params;

    esquemaMentoria.findById(id)
        .then((mentorias) => res.json(mentorias))
        .catch((error) => res.json(error));

});


//eliminar un mentoria
router.delete('/mentorias/:id', (req, res) => {
    const { id } = req.params;

    esquemaMentoria.findByIdAndDelete({ _id: id })
        .then(() => { res.json({ mensaje: 'mentoria eliminado' }) })
        .catch((err) => res.json(err));
});

//Cambiar estado a la mentoria
router.put('/mentorias/estado/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const filter = { _id: id };

    esquemaMentoria.updateOne(filter, {$set: {estado: estado }})
        .then(() => { res.json({ mensaje: 'Estado de la mentoria actualizado' }) })
        .catch((err) => res.json(err));
});

//modificar monto pagado
router.put('/mentorias/montoPagado/:id', (req, res) => {
    const { id } = req.params;
    const { montoPagado } = req.body;
    const filter = { _id: id };
    esquemaMentoria.updateOne(filter, {$set: {montoPagado: montoPagado}})
        .then(() => { res.json({ mensaje: 'Monto pagado de la mentoria actualizado' }) })   
        .catch((err) => res.json(err));
});

// agregar usuario a mentoria
router.post('/mentorias/agregarusuario/:id', (req, res) => {
    const { email } = req.body;
    const { idmentoria } = req.params;
    console.log(idmentoria);
    esquemaMentoria.findById(idmentoria)
        .then((mentoria) => { //revisa que el usuario no este ya en el mentoria
            if (mentoria.correoUsuarios.length > 0) {
                for (let i = 0; i < mentoria.correoUsuarios.length; i++) {
                    if (mentoria.correoUsuarios[i] == email) {
                        return res.status(400).json({ error: "El usuario ya está en la mentoria" });
                    }
                }
            }


            mentoria.correoUsuarios.push(email);
            mentoria.save()
                .then(() => res.json({ mensaje: "Usuario agregado a la mentoria" }))
                .catch((error) => res.json(error));
        })
});
// eliminar miembro del mentoria
router.delete('/eliminarMiembroP', (req, res) => {
    const { idmentoria, idUsuario } = req.body;

    esquemaMentoria.findById(idmentoria)
        .then((mentoria) => {
            let indice = -1;
            for (let i = 0; i < mentoria.miembros.length; i++) {
                if (mentoria.miembros[i] == idUsuario) {
                    indice = i;
                }
            }

            if (indice == -1) {
                return res.status(400).json({ error: "El usuario no está en el mentoria" });
            } else {
                mentoria.miembros.splice(indice, 1);
                mentoria.save()
                    .then(() => res.json({ mensaje: "Usuario eliminado del mentoria" }))
                    .catch((error) => res.json(error));
            }
        });
});


// actualizar montoReca
router.put('/mentorias/actualizarMonto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { montoRecaS } = req.body;

        // Asegurarse de esperar la resolución de la promesa
        const mentoriaActualizado = await esquemaMentoria.findByIdAndUpdate(
            id,
            { $set: { montoReca: montoRecaS } },
            { new: true }
        );

        if (!mentoriaActualizado) {
            return res.status(404).json({ mensaje: 'mentoria no encontrado' });
        }

        // Enviar respuesta como JSON
        res.json(CircularJSON.stringify(mentoriaActualizado));
    } catch (error) {
        console.error("Error al actualizar el mentoria:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// traer mentorias por el correo
router.get('/mentoriasPorCorreo/:correo', async (req,res) => {
    const { correo } = req.params;
    let mentorias = [];
    esquemaMentoria.find()
        .then((mentoria) => {
            mentoria.forEach(mentoria => {
                if (mentoria.correoMentor == correo) {
                    mentorias.push(mentoria);
                }
            });
            res.json(mentorias);
        })
        .catch((error) => res.json(error));
    

});

module.exports = router;