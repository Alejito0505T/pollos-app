const ProveedorModel = require('../models/proveedorModel');

class ProveedorController {

    static async listar(req, res, next) {
        try {
            const proveedores = await ProveedorModel.obtenerTodos();
            res.json({ ok: true, mensaje: `${proveedores.length} proveedor(es) encontrado(s).`, datos: proveedores });
        } catch (error) { next(error); }
    }

    static async obtenerUno(req, res, next) {
        try {
            const proveedor = await ProveedorModel.obtenerPorId(req.params.id);
            if (!proveedor) return res.status(404).json({ ok: false, mensaje: 'Proveedor no encontrado.' });
            res.json({ ok: true, mensaje: 'Proveedor encontrado.', datos: proveedor });
        } catch (error) { next(error); }
    }

    static async crear(req, res, next) {
        try {
            const nuevo = await ProveedorModel.crear(req.body);
            res.status(201).json({ ok: true, mensaje: 'Proveedor registrado exitosamente.', datos: nuevo });
        } catch (error) { next(error); }
    }

    static async actualizar(req, res, next) {
        try {
            const actualizado = await ProveedorModel.actualizar(req.params.id, req.body);
            if (!actualizado) return res.status(404).json({ ok: false, mensaje: 'Proveedor no encontrado.' });
            res.json({ ok: true, mensaje: 'Proveedor actualizado exitosamente.' });
        } catch (error) { next(error); }
    }

    static async eliminar(req, res, next) {
        try {
            const eliminado = await ProveedorModel.eliminar(req.params.id);
            if (!eliminado) return res.status(404).json({ ok: false, mensaje: 'Proveedor no encontrado.' });
            res.json({ ok: true, mensaje: 'Proveedor eliminado exitosamente.' });
        } catch (error) { next(error); }
    }
}

module.exports = ProveedorController;