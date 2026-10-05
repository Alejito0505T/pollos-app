const pool = require('../config/database');

class FiadoModel {

    static async obtenerPendientes() {
        const [filas] = await pool.query(`
            SELECT
                f.id AS fiado_id,
                f.fecha_vencimiento,
                f.estado,
                v.id AS venta_id,
                v.total,
                c.id AS cliente_id,
                c.nombre AS cliente_nombre,
                COALESCE((SELECT SUM(a.monto) FROM abonos a WHERE a.fiado_id = f.id), 0) AS total_abonado,
                v.total - COALESCE((SELECT SUM(a.monto) FROM abonos a WHERE a.fiado_id = f.id), 0) AS saldo_pendiente
            FROM fiados f
            JOIN ventas v ON f.venta_id = v.id
            JOIN clientes c ON v.cliente_id = c.id
            WHERE f.estado != 'pagado'
            ORDER BY f.fecha_vencimiento ASC
        `);
        return filas;
    }

    static async registrarAbono(fiadoId, monto) {
        await pool.query(
            'INSERT INTO abonos (fiado_id, monto) VALUES (?, ?)',
            [fiadoId, monto]
        );

        // Revisar si ya quedó pagado por completo
        const [filas] = await pool.query(`
            SELECT v.total,
                COALESCE((SELECT SUM(a.monto) FROM abonos a WHERE a.fiado_id = f.id), 0) AS total_abonado
            FROM fiados f
            JOIN ventas v ON f.venta_id = v.id
            WHERE f.id = ?
        `, [fiadoId]);

        const { total, total_abonado } = filas[0];
        if (Number(total_abonado) >= Number(total)) {
            await pool.query("UPDATE fiados SET estado = 'pagado' WHERE id = ?", [fiadoId]);
        }

        return { fiadoId, monto, saldo_pendiente: Math.max(total - total_abonado, 0) };
    }

    static async marcarVencidos() {
        await pool.query(
            "UPDATE fiados SET estado = 'vencido' WHERE estado = 'pendiente' AND fecha_vencimiento < CURDATE()"
        );
    }

    static async obtenerCartera() {
        const [filas] = await pool.query(`
            SELECT c.id AS cliente_id, c.nombre,
                SUM(v.total - COALESCE((SELECT SUM(a.monto) FROM abonos a WHERE a.fiado_id = f.id), 0)) AS deuda_total
            FROM fiados f
            JOIN ventas v ON f.venta_id = v.id
            JOIN clientes c ON v.cliente_id = c.id
            WHERE f.estado != 'pagado'
            GROUP BY c.id, c.nombre
            ORDER BY deuda_total DESC
        `);
        return filas;
    }
}

module.exports = FiadoModel;