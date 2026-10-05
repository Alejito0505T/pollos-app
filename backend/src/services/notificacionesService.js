const pool = require('../config/database');
const { enviarCorreo } = require('../utils/mailer');

const STOCK_MINIMO = 10; // ajusta este número a tu gusto

class NotificacionesService {

    static async revisarStockBajo() {
        const [filas] = await pool.query(`
            SELECT
                (SELECT COALESCE(SUM(cantidad_pollos), 0) FROM inventario) -
                (SELECT COUNT(*) FROM ventas) AS stock
        `);
        const stock = filas[0].stock;

        if (stock <= STOCK_MINIMO) {
            await enviarCorreo({
                asunto: `⚠️ Stock bajo: quedan ${stock} pollos`,
                html: `<h2>Alerta de inventario</h2><p>Solo quedan <b>${stock}</b> pollos disponibles. Es hora de hacer un nuevo pedido al proveedor.</p>`
            });
            console.log('Correo de stock bajo enviado.');
        }
    }

    static async resumenDiario() {
        const [filas] = await pool.query(`
            SELECT COUNT(*) AS num_ventas, COALESCE(SUM(total), 0) AS total_vendido
            FROM ventas
            WHERE DATE(fecha) = CURDATE()
        `);
        const { num_ventas, total_vendido } = filas[0];

        await enviarCorreo({
            asunto: `📊 Resumen del día - ${new Date().toLocaleDateString()}`,
            html: `<h2>Resumen de ventas de hoy</h2>
                   <p>Ventas realizadas: <b>${num_ventas}</b></p>
                   <p>Total vendido: <b>$${Number(total_vendido).toLocaleString()}</b></p>`
        });
        console.log('Correo de resumen diario enviado.');
    }

    static async recordatorioFiados() {
        const [filas] = await pool.query(`
            SELECT f.id, f.fecha_vencimiento, c.nombre, v.total
            FROM fiados f
            JOIN ventas v ON f.venta_id = v.id
            JOIN clientes c ON v.cliente_id = c.id
            WHERE f.estado = 'pendiente'
              AND f.fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 2 DAY)
        `);

        if (filas.length === 0) return;

        const lista = filas.map(f =>
            `<li>${f.nombre} debe $${Number(f.total).toLocaleString()} - vence ${new Date(f.fecha_vencimiento).toLocaleDateString()}</li>`
        ).join('');

        await enviarCorreo({
            asunto: `🔔 ${filas.length} fiado(s) por vencer`,
            html: `<h2>Fiados próximos a vencer</h2><ul>${lista}</ul>`
        });
        console.log('Correo de recordatorio de fiados enviado.');
    }
}

module.exports = NotificacionesService;