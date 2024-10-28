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


//informe general
router.get('/informeG', (req, res) => {
    //obtener todos los mentorias
    let contadorFinalizadas = 0;
    let contadorEnCurso = 0;
    let contadorPendientes = 0;
    let listTareas = [];
    esquemaMentoria.find()
        .then((mentorias) => {
            for (let i = 0; i < mentorias.length; i++) {


                listTareas = mentorias[i].tareas;


                for (const tarea of listTareas) {
                    //console.log(tarea)
                    if (tarea.estado === "Finalizada") {
                        contadorFinalizadas += 1
                    }
                    else if (tarea.estado === "En curso") {
                        contadorEnCurso += 1
                    }
                    else if (tarea.estado === "Pendiente") {
                        contadorPendientes += 1
                    }
                };


            }
            const informeGen = {
                tareasFinalizadas: contadorFinalizadas,
                tareasEnCurso: contadorEnCurso,
                tareasPendientes: contadorPendientes
            };
            return res.json(informeGen);
        })
        .catch((error) => res.json(error));
});


// agregar usuario al mentoria
router.post('/agregarusuarioP', (req, res) => {
    const { idmentoria, email } = req.body;
    console.log(idmentoria);
    esquemaMentoria.findById(idmentoria)
        .then((mentoria) => { //revisa que el usuario no este ya en el mentoria
            if (mentoria.correoColaboradores.length > 0) {
                for (let i = 0; i < mentoria.correoColaboradores.length; i++) {
                    if (mentoria.correoColaboradores == email) {
                        return res.status(400).json({ error: "El usuario ya está en el mentoria" });
                    }
                }
            }


            mentoria.correoColaboradores.push(email);
            mentoria.save()
                .then(() => res.json({ mensaje: "Usuario agregado al mentoria" }))
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

// Informe general de todos los mentorias
router.get('/informe-general', (req, res) => {
    esquemaMentoria.find()
        .then(mentorias => {
            let totalToDo = 0;
            let totalInProgress = 0;
            let totalFinished = 0;

            mentorias.forEach(mentoria => {
                totalToDo += mentoria.tareas.filter(tarea => tarea.estado === 'Pendiente').length;
                totalInProgress += mentoria.tareas.filter(tarea => tarea.estado === 'En curso').length;
                totalFinished += mentoria.tareas.filter(tarea => tarea.estado === 'Finalizada').length;
            });

            const data = {
                totalPorHacer: totalToDo,
                totalEnProgreso: totalInProgress,
                totalFinalizadas: totalFinished
            };

            res.json(data);
        })
        .catch(error => res.json(error));
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


module.exports = router;