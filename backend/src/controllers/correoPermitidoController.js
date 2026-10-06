const CorreoPermitidoModel = require('../models/correoPermitidoModel');

class CorreoPermitidoController {

    static async listar(req, res, next) {
        try {
            const correos = await CorreoPermitidoModel.listar();
            res.json({ ok: true, mensaje: `${correos.length} correo(s) permitido(s).`, datos: correos });
        } catch (error) { next(error); }
    }

    static async agregar(req, res, next) {
        try {
            const { email, rol } = req.body;
            if (!email) {
                return res.status(400).json({ ok: false, mensaje: 'El email es obligatorio.' });
            }
            const nuevo = await CorreoPermitidoModel.agregar(email, rol);
            res.status(201).json({ ok: true, mensaje: 'Correo autorizado.', datos: nuevo });
        } catch (error) { next(error); }
    }

    static async eliminar(req, res, next) {
        try {
            const eliminado = await CorreoPermitidoModel.eliminar(req.params.email);
            if (!eliminado) {
                return res.status(404).json({ ok: false, mensaje: 'Correo no encontrado en la lista.' });
            }
            res.json({ ok: true, mensaje: 'Correo removido de la lista de permitidos.' });
        } catch (error) { next(error); }
    }
}

module.exports = CorreoPermitidoController;