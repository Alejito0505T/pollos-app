const VentaModel = require('../models/ventaModel');

class VentaController {

    static async listar(req, res, next) {
        try {
            const ventas = await VentaModel.obtenerTodos();
            res.json({ ok: true, mensaje: `${ventas.length} venta(s) encontrada(s).`, datos: ventas });
        } catch (error) { next(error); }
    }

    static async crear(req, res, next) {
        try {
            const resultado = await VentaModel.crear(req.body);
            res.status(201).json({ ok: true, mensaje: 'Venta registrada exitosamente.', datos: resultado });
        } catch (error) { next(error); }
    }

    static async actualizar(req, res, next) {
        try {
            const actualizado = await VentaModel.actualizar(req.params.id, req.body);
            if (!actualizado) {
                return res.status(404).json({ ok: false, mensaje: 'Venta no encontrada.' });
            }
            res.json({ ok: true, mensaje: 'Venta actualizada.' });
        } catch (error) { next(error); }
    }

    static async eliminar(req, res, next) {
        try {
            const eliminado = await VentaModel.eliminar(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ ok: false, mensaje: 'Venta no encontrada.' });
            }
            res.json({ ok: true, mensaje: 'Venta eliminada.' });
        } catch (error) { next(error); }
    }
}

module.exports = VentaController;