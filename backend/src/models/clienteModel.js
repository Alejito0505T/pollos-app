const pool = require('../config/database');

class ClienteModel {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            'SELECT * FROM clientes WHERE activo = 1 ORDER BY nombre'
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            'SELECT * FROM clientes WHERE id = ?',
            [id]
        );
        return filas[0];
    }

    static async crear(datos) {
        const { nombre, telefono, email, direccion } = datos;
        const [resultado] = await pool.query(
            `INSERT INTO clientes (nombre, telefono, email, direccion)
             VALUES (?, ?, ?, ?)`,
            [nombre, telefono, email || null, direccion || null]
        );
        return { id: resultado.insertId, nombre, telefono, email, direccion };
    }

    static async actualizar(id, datos) {
        const { nombre, telefono, email, direccion } = datos;
        const [resultado] = await pool.query(
            `UPDATE clientes
             SET nombre = ?, telefono = ?, email = ?, direccion = ?
             WHERE id = ?`,
            [nombre, telefono, email || null, direccion || null, id]
        );
        return resultado.affectedRows > 0;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            'UPDATE clientes SET activo = 0 WHERE id = ?',
            [id]
        );
        return resultado.affectedRows > 0;
    }
}

module.exports = ClienteModel;