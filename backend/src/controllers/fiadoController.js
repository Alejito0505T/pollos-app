const FiadoModel = require('../models/fiadoModel');

class FiadoController {

    static async listarPendientes(req, res, next) {
        try {
            await FiadoModel.marcarVencidos();
            const fiados = await FiadoModel.obtenerPendientes();
            res.json({ ok: true, mensaje: `${fiados.length} fiado(s) pendiente(s).`, datos: fiados });
        } catch (error) { next(error); }
    }

    static async abonar(req, res, next) {
        try {
            const resultado = await FiadoModel.registrarAbono(req.params.id, req.body.monto);
            res.status(201).json({ ok: true, mensaje: 'Abono registrado exitosamente.', datos: resultado });
        } catch (error) { next(error); }
    }

    static async cartera(req, res, next) {
        try {
            const cartera = await FiadoModel.obtenerCartera();
            res.json({ ok: true, mensaje: 'Cartera calculada.', datos: cartera });
        } catch (error) { next(error); }
    }
}

module.exports = FiadoController;