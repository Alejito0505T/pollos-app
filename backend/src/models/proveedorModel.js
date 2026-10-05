const pool = require('../config/database');

class ProveedorModel {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            'SELECT * FROM proveedores WHERE activo = 1 ORDER BY nombre'
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
        return filas[0];
    }

    static async crear(datos) {
        const { nombre, telefono, precio_compra_lb } = datos;
        const [resultado] = await pool.query(
            'INSERT INTO proveedores (nombre, telefono, precio_compra_lb) VALUES (?, ?, ?)',
            [nombre, telefono || null, precio_compra_lb]
        );
        return { id: resultado.insertId, nombre, telefono, precio_compra_lb };
    }

    static async actualizar(id, datos) {
        const { nombre, telefono, precio_compra_lb } = datos;
        const [resultado] = await pool.query(
            'UPDATE proveedores SET nombre = ?, telefono = ?, precio_compra_lb = ? WHERE id = ?',
            [nombre, telefono || null, precio_compra_lb, id]
        );
        return resultado.affectedRows > 0;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query('UPDATE proveedores SET activo = 0 WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    }
}

module.exports = ProveedorModel;
