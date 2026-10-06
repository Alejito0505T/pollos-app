const pool = require('../config/database');

class VentaModel {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT v.*, c.nombre AS cliente_nombre
             FROM ventas v
             JOIN clientes c ON v.cliente_id = c.id
             ORDER BY v.fecha DESC`
        );
        return filas;
    }

    static async crear(datos) {
        const { cliente_id, peso_lb, precio_lb, es_fiado } = datos;

        const [resultado] = await pool.query(
            'INSERT INTO ventas (cliente_id, peso_lb, precio_lb, es_fiado) VALUES (?, ?, ?, ?)',
            [cliente_id, peso_lb, precio_lb, es_fiado ? 1 : 0]
        );
        const ventaId = resultado.insertId;

        let fiado = null;
        if (es_fiado) {
            const [filaFecha] = await pool.query(
                'SELECT DATE_ADD(CURDATE(), INTERVAL 15 DAY) AS vencimiento'
            );
            const vencimiento = filaFecha[0].vencimiento;

            const [resFiado] = await pool.query(
                'INSERT INTO fiados (venta_id, fecha_vencimiento) VALUES (?, ?)',
                [ventaId, vencimiento]
            );
            fiado = { id: resFiado.insertId, venta_id: ventaId, fecha_vencimiento: vencimiento };
        }

        const [filaVenta] = await pool.query('SELECT * FROM ventas WHERE id = ?', [ventaId]);
        return { venta: filaVenta[0], fiado };
    }

    static async actualizar(id, datos) {
        const { cliente_id, peso_lb, precio_lb, fecha } = datos;
        const [resultado] = await pool.query(
            'UPDATE ventas SET cliente_id = ?, peso_lb = ?, precio_lb = ?, fecha = ? WHERE id = ?',
            [cliente_id, peso_lb, precio_lb, fecha, id]
        );
        return resultado.affectedRows > 0;
    }

    static async eliminar(id) {
        await pool.query('DELETE FROM fiados WHERE venta_id = ?', [id]);
        const [resultado] = await pool.query('DELETE FROM ventas WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    }
}

module.exports = VentaModel;