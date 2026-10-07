const InventarioModel = require('../models/inventarioModel');

class InventarioController {

    static async listar(req, res, next) {
        try {
            const inventario = await InventarioModel.obtenerTodos();
            res.json({ ok: true, mensaje: `${inventario.length} ingreso(s) encontrado(s).`, datos: inventario });
        } catch (error) { next(error); }
    }

    static async crear(req, res, next) {
        try {
            const nuevo = await InventarioModel.crear(req.body);
            res.status(201).json({ ok: true, mensaje: 'Ingreso de inventario registrado.', datos: nuevo });
        } catch (error) { next(error); }
    }

    static async stock(req, res, next) {
        try {
            const stock = await InventarioModel.obtenerStockActual();
            res.json({ ok: true, mensaje: 'Stock actual calculado.', datos: { stock_disponible: stock } });
        } catch (error) { next(error); }
    }

    static async eliminar(req, res, next) {
        try {
            const existe = await InventarioModel.obtenerPorId(req.params.id);
            if (!existe) {
                return res.status(404).json({ ok: false, mensaje: 'Ese registro de compra no existe.' });
            }
            await InventarioModel.eliminar(req.params.id);
            res.json({ ok: true, mensaje: 'Compra eliminada.' });
        } catch (error) { next(error); }
    }
}

module.exports = InventarioController;