const express = require('express');
const esquemaProyecto = require('../modelosDatos/proyecto');
const Usuario = require('../modelosDatos/usuario');
const { ExplainVerbosity } = require('mongodb');
const moment = require('moment');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const CircularJSON = require('circular-json');

//crear proyecto
router.post('/proyectos', (req, res) => {

    const proyecto = esquemaProyecto(req.body); // Create a new instance of the esquemaProyecto model

    proyecto.save()
        .then(() => { res.json(proyecto) })
        .catch((error) => res.json(error));



});

//obtener los proyectos
router.get('/proyectos', (req, res) => {
    esquemaProyecto.find()
        .then((proyectos) => res.json(proyectos))
        .catch((error) => res.json(error));
});

//obtener proyecto por correo de usuario
router.get('/proyectos/:correo', (req, res) => {
    let proyectos = []
    const { correo } = req.params;
    esquemaProyecto.find()
        .then((proyect) => {
            proyect.forEach(proyecto => {
                if (proyecto.correoResponsable == correo){
                    proyectos.push(proyecto);
                }
            });
            res.json(proyectos);
        })
        .catch((error) => res.json(error));

});

//obtener lista de los Id de los proyectos
router.get('/proyectosId', (req, res) => {
    let ids_proyec = [];

    esquemaProyecto.find()
        .select("id")
        .exec()
        .then((idsProyecto) => {
            for (let i = 0; i < idsProyecto.length; i++) {
                ids_proyec.push(idsProyecto[i].id);
            }
            res.json({ Ids: ids_proyec });
        })
        .catch((error) => res.json(error));
});

//buscar proyecto por id
router.get('/proyectosID/:id', (req, res) => {
    const { id } = req.params;

    esquemaProyecto.findById(id)
        .then((proyectos) => res.json(proyectos))
        .catch((error) => res.json(error));

});

//actualizar un proyecto
router.put('/proyectos/:id/:correo/:name', async (req, res) => {
    const { id } = req.params;
    const { correo } = req.params;
    const { name } = req.params;
    const { descripcion, objetivoF, categoriaP, mediaItems } = req.body;

    esquemaProyecto.updateOne({ _id: id }, { $set: { descripcion, objetivoF, categoriaP, mediaItems } })
        .then(() => { res.json({ mensaje: 'Proyecto actualizado' }) })
        .catch((err) => res.json(err));

    const msg = {
        to: correo,
        from: 'gomezacunav@gmail.com',
        subject: '¡Su Proyecto en Fund a Cause ha sido Actualizado!',
        text: 'Su proyecto en Fund a Cause ha sido actualizado exitosamente. Gracias por su continua dedicación.',
        html: `
            <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50;">¡Su Proyecto ha sido Actualizado!</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    Estimado/a,
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Nos complace informarle que su proyecto en <strong>Fund a Cause</strong> ha sido actualizado exitosamente.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Gracias por su compromiso y esfuerzo continuo para hacer avanzar su causa. Estamos emocionados de ver el impacto de su proyecto.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Si tiene alguna pregunta o necesita asistencia adicional, no dude en ponerse en contacto con nuestro equipo de soporte.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Atentamente,<br>
                    El equipo de Fund a Cause
                </p>
            </div>
        </body>
        </html>
    `
        };
    
        try{
            
            await sgMail.send(msg);
            console.log('Correo enviado con éxito');
        }
        catch(error){
            console.log(error);
        }
});

//eliminar un proyecto
router.delete('/proyectos/:id', (req, res) => {
    const { id } = req.params;

    esquemaProyecto.findByIdAndDelete({ _id: id })
        .then(() => { res.json({ mensaje: 'Proyecto eliminado' }) })
        .catch((err) => res.json(err));
});


// agregar usuario al proyecto
router.post('/agregarusuarioP', (req, res) => {
    const { idProyecto, email } = req.body;
    console.log(idProyecto);
    esquemaProyecto.findById(idProyecto)
        .then((proyecto) => { //revisa que el usuario no este ya en el proyecto
            if (proyecto.correoColaboradores.length > 0) {
                for (let i = 0; i < proyecto.correoColaboradores.length; i++) {
                    if (proyecto.correoColaboradores == email) {
                        return res.status(400).json({ error: "El usuario ya está en el proyecto" });
                    }
                }
            }


            proyecto.correoColaboradores.push(email);
            proyecto.save()
                .then(() => res.json({ mensaje: "Usuario agregado al proyecto" }))
                .catch((error) => res.json(error));
        })
});
// eliminar miembro del proyecto
router.delete('/eliminarMiembroP', (req, res) => {
    const { idProyecto, idUsuario } = req.body;

    esquemaProyecto.findById(idProyecto)
        .then((proyecto) => {
            let indice = -1;
            for (let i = 0; i < proyecto.miembros.length; i++) {
                if (proyecto.miembros[i] == idUsuario) {
                    indice = i;
                }
            }

            if (indice == -1) {
                return res.status(400).json({ error: "El usuario no está en el proyecto" });
            } else {
                proyecto.miembros.splice(indice, 1);
                proyecto.save()
                    .then(() => res.json({ mensaje: "Usuario eliminado del proyecto" }))
                    .catch((error) => res.json(error));
            }
        });
});




// actualizar montoReca
router.put('/proyectos/actualizarMonto', async (req, res) => {
    try {
        const { id } = req.body;
        const { montoRecaS } = req.body;

        // Asegurarse de esperar la resolución de la promesa
        const proyectoActualizado = await esquemaProyecto.findByIdAndUpdate(
            id,
            { $set: { montoReca: montoRecaS } },
            { new: true }
        );

        if (!proyectoActualizado) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }

        // Enviar respuesta como JSON
        res.json(CircularJSON.stringify(proyectoActualizado));
    } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;