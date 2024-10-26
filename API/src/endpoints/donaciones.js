const express = require('express');
const esquemaDonacion = require('../modelosDatos/donacion');
const Usuario = require('../modelosDatos/usuario');
const Proyecto = require('../modelosDatos/proyecto');
const router = express.Router();
const sgMail = require('@sendgrid/mail');


// Trae todos los Donaciones
router.get('/donaciones', (req, res) => {
    esquemaDonacion.find()
        .then((donaciones) => res.json(donaciones))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Trae los Donaciones por correo
router.get('/donaciones/:correo', (req, res) => {
    const correo = req.params.correo;
    console.log("en el endpoint "+correo)
    esquemaDonacion.find({ correoDonante: correo })
        .then((donaciones) => res.json(donaciones))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Guarda una donacion
router.post('/donaciones/:responsable', (req, res) => {
    const donacion = new esquemaDonacion(req.body);
    const donante = donacion.correoDonante;
    const proy = donacion.nombreProyecto;
    const responsable = req.params.responsable;

    donacion.save()
    .then( async(donaciones) => {

        
        res.json(donaciones)
        const msg = {
        to: donante,
        from: 'gomezacunav@gmail.com',
        subject: 'Fund a Cause: Donación realizada',
        text: `Su donacion de Fund a Cause ha realizada exitosamente`,
        html: `
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50;">¡Gracias por su generosidad!</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    Su donación a <strong>Fund a Cause</strong> ha sido realizada exitosamente.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Su apoyo es invaluable para nosotros y para aquellos a quienes ayudamos. 
                    Gracias por hacer una diferencia con su contribución.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Si tiene alguna pregunta o necesita más información, no dude en contactarnos.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Atentamente,<br>
                    El equipo de Fund a Cause
                </p>
            </div>
        </body>
        </html>
    `};

        const msg2 = {
            to: responsable,
            from: 'gomezacunav@gmail.com',
            subject: 'Nueva Donación Recibida en Fund a Cause',
            text: 'Una nueva donación ha sido realizada con éxito a su proyecto en Fund a Cause.',
            html: `
            <html>
            <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50;">¡Nueva Donación Recibida!</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    Estimado/a usuario/a,
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Nos complace informarle que se ha realizado una nueva donación a su proyecto ${proy} en <strong>Fund a Cause</strong>. 
                    Su proyecto sigue recibiendo apoyo de generosos donantes que creen en su causa.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Agradecemos profundamente su dedicación y esfuerzo. Cada contribución ayuda a avanzar en el objetivo de su proyecto y a hacer una diferencia real.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Si tiene alguna pregunta o necesita más información, no dude en contactarnos.
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
            await sgMail.send(msg2);
            console.log('Correo enviado con éxito');
        }
        catch(error){
            console.log(error);
        }
    })
    
    
    .catch((error) => res.json(error));
            

    
});

// Update a donation with media link
router.put('/donaciones/:id', (req, res) => {
    const { id } = req.params;
    const { link } = req.body;
    esquemaDonacion.updateOne({ _id: id }, { $set: { mediaLink: link } })
        .then(() => res.status(204).send())
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Delete a donation
router.delete('/donaciones/:id', (req, res) => {
    const { id } = req.params;
    esquemaDonacion.deleteOne({ _id: id })
        .then(() => res.status(204).send())
        .catch((error) => res.status(500).json({ error: error.message }));
});

module.exports = router;
/*
// Trae los Donaciones por correo
router.get('/donaciones/:correo', async (req, res) => {
    try {
        const donaciones = await Donaciones.find({ correoDonante: req.params.correo });
        res.json(donaciones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guarda una donacion
router.post('/donaciones', async (req, res) => {
    try {
        const donacion = req.body;

        // Validate the user
        const usuarioEx = await Usuario.find({ correo: donacion.correoDonante });
        if (usuarioEx.length === 0) {
            return res.status(409).json({ error: 'este usuario no existe' });
        }

        // Validate the project
        const proyecto = await Proyecto.find({ _id: donacion.proyectoId });
        if (proyecto.length === 0) {
            return res.status(409).json({ error: 'este proyecto no existe' });
        }

        // Validate the user's funds
        if (Math.abs(usuarioEx[0].dineroInicial) < donacion.monto) {
            return res.status(409).json({ error: 'este usuario no cuenta con los fondos suficientes' });
        }

        // Save the donation
        await Donaciones.create(donacion);

        // Update the user's funds
        const updatedDinero = usuarioEx[0].dineroInicial - donacion.monto;
        await Usuario.updateOne({ correo: donacion.correoDonante }, { dineroInicial: updatedDinero });

        // Add donation to user's list
        await Usuario.updateOne({ correo: donacion.correoDonante }, { $push: { donaciones: donacion._id } });

        // Update the project's collected amount
        const updatedMontoReca = Math.abs(proyecto[0].montoReca) + donacion.monto;
        await Proyecto.updateOne({ _id: donacion.proyectoId }, { montoReca: updatedMontoReca });

        // Add donation to project's list
        await Proyecto.updateOne({ _id: donacion.proyectoId }, { $push: { donaciones: donacion._id } });

        res.status(201).json(donacion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a donation with media link
router.put('/donaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { link } = req.body;
        await Donaciones.updateOne({ _id: id }, { $set: { mediaLink: link } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a donation
router.delete('/donaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Donaciones.deleteOne({ _id: id });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; */
