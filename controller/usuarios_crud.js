const jwt = require('jsonwebtoken')
const { promisify } = require('util')

exports.traer = async (req, res, next) => {
    try {
        // Hacer una solicitud GET al endpoint de la API
        const response = await fetch(`${process.env.pathApi}/traer_usuarios`);
        const data = await response.json(); // Convertir la respuesta a JSON
        // Guardar los datos en `res.locals` para que estén disponibles en la vista
        res.locals.data = data;
        next(); // Pasar el control a la siguiente función en la cadena de middleware
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.traerEspera = async (req, res, next) => {
    try {
        // Hacer una solicitud GET al endpoint de la API
        const response = await fetch(`${process.env.pathApi}/usuariosEspera`);
        const data = await response.json(); // Convertir la respuesta a JSON
        // Guardar los datos en `res.locals` para que estén disponibles en la vista
        res.locals.data = data;
        next(); // Pasar el control a la siguiente función en la cadena de middleware
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.agregarUsuario = async (req, res, next) => {
    try {
        const usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            fecha_nacimiento: req.body.fecha_nacimiento,
            gmail: req.body.gmail,
            contraseña: req.body.contraseña,
            id_clase: req.body.id_clase,
            id_rol: req.body.id_rol,
            estado: req.body.estado
        };

        const response = await fetch('http://localhost:4000/api/agregar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        console.log(response)
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${await response.text()}`);
        }

        const data = await response.json();
        console.log('Datos del servidor:', data);

        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;

        const response = await fetch(`http://localhost:4000/api/obtener_usuario/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${await response.text()}`);
        }

        const data = await response.json();
        console.log('Datos del usuario:', data);

        res.locals.usuario = data;
        next();
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Controlador del proyecto principal
exports.editarUsuario = async (req, res) => {
    const { id } = req.params;

    // Hacer la solicitud a la API
    try {
        const response = await fetch(`${process.env.pathApi}/editar_usuario/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error desconocido');
        }

        // Redirigir a la vista de usuarios después de la edición exitosa
        res.redirect('/usuarios'); // Asegúrate de que esta ruta sea correcta
    } catch (error) {
        console.error('Error al editar el usuario en el proyecto:', error);
        res.status(500).json({ error: 'Error al editar el usuario' });
    }
};










exports.eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const url = `${process.env.pathApi}/eliminar/${id}`;

        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${await response.text()}`);
        }

        res.json({ message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
