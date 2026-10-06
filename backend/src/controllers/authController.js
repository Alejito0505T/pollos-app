const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');
const CorreoPermitidoModel = require('../models/correoPermitidoModel');

class AuthController {

    static async registrar(req, res, next) {
        try {
            const { nombre, email, password, rol } = req.body;
            if (!nombre || !email || !password) {
                return res.status(400).json({ ok: false, mensaje: 'nombre, email y password son obligatorios.' });
            }

            const permitido = await CorreoPermitidoModel.estaPermitido(email);
            if (!permitido) {
                return res.status(403).json({ ok: false, mensaje: 'Este correo no está autorizado para registrarse.' });
            }

            const existente = await UsuarioModel.obtenerPorEmail(email);
            if (existente) {
                return res.status(400).json({ ok: false, mensaje: 'Ese email ya está registrado.' });
            }
            const nuevo = await UsuarioModel.crear({ nombre, email, password, rol: permitido.rol });
            res.status(201).json({ ok: true, mensaje: 'Usuario creado exitosamente.', datos: nuevo });
        } catch (error) { next(error); }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const permitido = await CorreoPermitidoModel.estaPermitido(email);
            if (!permitido) {
                return res.status(403).json({ ok: false, mensaje: 'Este correo no está autorizado para ingresar.' });
            }

            const usuario = await UsuarioModel.obtenerPorEmail(email);
            if (!usuario) {
                return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
            }
            const coincide = await UsuarioModel.compararPassword(password, usuario.password_hash);
            if (!coincide) {
                return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
            }

            const token = jwt.sign(
                { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                ok: true,
                mensaje: 'Login exitoso.',
                datos: { token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } }
            });
        } catch (error) { next(error); }
    }
}

module.exports = AuthController;