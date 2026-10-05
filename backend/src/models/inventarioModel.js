const pool = require('../config/database');

class InventarioModel {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT i.*, p.nombre AS proveedor_nombre
             FROM inventario i
             LEFT JOIN proveedores p ON i.proveedor_id = p.id
             ORDER BY i.fecha_ingreso DESC`
        );
        return filas;
    }

    static async crear(datos) {
        const { cantidad_pollos, fecha_ingreso, proveedor_id } = datos;
        const [resultado] = await pool.query(
            'INSERT INTO inventario (cantidad_pollos, fecha_ingreso, proveedor_id) VALUES (?, ?, ?)',
            [cantidad_pollos, fecha_ingreso, proveedor_id || null]
        );
        return { id: resultado.insertId, cantidad_pollos, fecha_ingreso, proveedor_id };
    }

    static async obtenerStockActual() {
        const [filas] = await pool.query(
            `SELECT
                (SELECT COALESCE(SUM(cantidad_pollos), 0) FROM inventario) -
                (SELECT COUNT(*) FROM ventas) AS stock_disponible`
        );
        return filas[0].stock_disponible;
    }
}

module.exports = InventarioModel;