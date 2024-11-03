const express = require('express');
const esquemaUsuario = require('../modelosDatos/usuario');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Trae todos los usuarios
router.get('/usuarios', (req, res) => {
    esquemaUsuario.find()
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));
});

// Trae los usuarios por correo
router.get('/usuarios/correo/:correo', (req, res) => {
    const { correo } = req.params;
    esquemaUsuario.findOne({ email: correo }) // Usar findOne para obtener un solo usuario
    .then((usuario) => {
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    })
    .catch((error) => res.status(500).json(error));
});

// Actualizar dinero inicial de usuario
router.put('/usuarios/dinero/:correo', (req, res) => {
    const { correo } = req.params;
    const { dinero } = req.body;
    const filter = { email: correo };
    const plata = parseInt(dinero);

    esquemaUsuario.updateOne(filter, { $set: { dineroInicial: plata } })
        .then(() => res.status(200).json({ mensaje: 'Dinero inicial actualizado' }))
        .catch((error) => res.json(error));
});

router.put('/usuarios/des/:correo', (req, res) => {
    const { correo } = req.params;
    const estado = 'Inactivo';
    const filter = { email: correo };

    esquemaUsuario.updateOne(filter, { $set: { estado: estado } })
        .then(() => res.status(200).json({ mensaje: 'Estado actualizado' }))
        .catch((error) => res.json(error));
});

router.put('/usuarios/act/:correo', (req, res) => {
    const { correo } = req.params;
    const estado = 'Activo';
    const filter = { email: correo };

    esquemaUsuario.updateOne(filter, { $set: { estado: estado } })
        .then(() => res.status(200).json({ mensaje: 'Estado actualizado' }))
        .catch((error) => res.json(error));
});

//obtener correos de usuarios
router.get('/usuarios/correo', (req, res) => {
    let correos = []
    esquemaUsuario.find()
        .then((usuarios) => {
            usuarios.forEach(usuario => {
                correos.push(usuario.email)
            });
            res.json(correos)
        })
        .catch((error) => res.json(error));

});

// Guarda un usuario
router.post('/usuarios/', async (req, res) => {
    const usuario = new esquemaUsuario(req.body);
    
    usuario.save()
    .then( async(usuarios) => {

        
        res.json(usuarios)
        const msg = {
        to: usuario.email,
        from: 'gomezacunav@gmail.com',
        subject: '¡Bienvenido a Fund a Cause!',
        text: 'Su cuenta en Fund a Cause ha sido creada exitosamente. Gracias por unirse a nuestra comunidad.',
        html: `
            <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50;">¡Bienvenido a Fund a Cause!</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    Estimado/a <strong>${usuario.nombre}</strong>,
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Nos complace informarle que su cuenta en <strong>Fund a Cause</strong> ha sido creada exitosamente.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Ahora podrá acceder a todas las funciones de nuestra plataforma y empezar a apoyar causas importantes.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte.
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
    })
    
    
    .catch((error) => res.json(error));
            
});

//buscar usuario por id
router.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    esquemaUsuario.findById(id)
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));

});

// Agregar proyecto a un usuario
router.put('/usuariosP/:id', (req, res) => {
    const { id } = req.params;
    const { proyectoId } = req.body;

    esquemaUsuario.updateOne({ email: id }, { $push: { proyectoPropios: proyectoId } })
        .then(() => res.status(204).send())
        .catch((error) => res.json(error));
});

// Eliminar un usuario
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    esquemaUsuario.findByIdAndDelete(id)
        .then(() => { res.json({ mensaje: 'Usuario eliminado' }) })
        .catch((err) => res.json(err));
});

//obtener correos de usuarios
router.get('/usuarios/correo', (req, res) => {
    let correos = []
    esquemaUsuario.find()
        .then((usuarios) => {
            usuarios.forEach(usuario => {
                correos.push(usuario.email)
            });
            res.json(correos)
        })
        .catch((error) => res.json(error));

});

//Autenticación de usuario
router.post('/autenticacion', (req, res) => {
    const { email, contrasenna } = req.body;

    esquemaUsuario.findOne({ email }).then(usuario => {
        if (!usuario) {
            return res.status(500).json({ mensaje: 'Usuario no encontrado' });
        }
        if (usuario.contrasenna === contrasenna) {
            if (usuario.estado === 'Inactivo') {
                return res.status(500).json({ mensaje: 'Usuario desactivado'});
            }
            return res.status(200).json({mensaje: usuario});
        } else {
            return res.status(500).json({ mensaje: 'Credeniales incorrectas' });
        }
    })

});

router.put('/usuariosM', (req, res) => {


    const { emailM, email, departamento, telefono, proyecto } = req.body;

    esquemaUsuario.updateOne({ email: emailM }, { $set: { email, departamento, telefono, proyecto } })
        .then(() => { res.json({ mensaje: 'Usuario actualizado' }) })
        .catch((err) => res.json(err));
});

router.get('/usuariosMP/:email', (req, res)=>{
    const { email } = req.params;
    
    esquemaUsuario.findOne({email}).then(usuario =>{
        
        let proyectos = usuario.proyectoPropios;
        

        res.json(proyectos);

    })
    .catch((error) => res.json(error));
    

});

// Actualizar dinero del usuario
router.put('/usuarios/actualizarDinero/:correo', (req, res) => {
    const { correo } = req.params;
    const { nuevoMonto } = req.body;

    
    esquemaUsuario.findOneAndUpdate(
        { email: correo },          
        { $set: { dineroInicial: nuevoMonto } },  
        { new: true }               
    )
    .then((usuarioActualizado) => {
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.json(usuarioActualizado); 
    })
    .catch((error) => res.status(500).json({ message: 'Error al actualizar el dinero.', error }));
});

module.exports = router;
