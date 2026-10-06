const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const UsuarioModel = require('../models/usuarioModel');
const CorreoPermitidoModel = require('../models/correoPermitidoModel');

const clienteGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    static async loginGoogle(req, res, next) {
        try {
            const { credential } = req.body;
            if (!credential) {
                return res.status(400).json({ ok: false, mensaje: 'Falta el credential de Google.' });
            }

            const ticket = await clienteGoogle.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const email = payload.email;
            const nombre = payload.name || email;

            const permitido = await CorreoPermitidoModel.estaPermitido(email);
            if (!permitido) {
                return res.status(403).json({ ok: false, mensaje: 'Este correo no está autorizado para ingresar.' });
            }

            let usuario = await UsuarioModel.obtenerPorEmail(email);
            if (!usuario) {
                usuario = await UsuarioModel.crearDesdeGoogle({ nombre, email, rol: permitido.rol });
            }

            const token = jwt.sign(
                { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                ok: true,
                mensaje: 'Login con Google exitoso.',
                datos: { token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } }
            });
        } catch (error) { next(error); }
    }
}

module.exports = AuthController;