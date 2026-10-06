const pool = require('../config/database');

class CorreoPermitidoModel {

    static async estaPermitido(email) {
        const [filas] = await pool.query('SELECT * FROM correos_permitidos WHERE email = ?', [email]);
        return filas[0];
    }

    static async listar() {
        const [filas] = await pool.query('SELECT * FROM correos_permitidos ORDER BY creado_en DESC');
        return filas;
    }

    static async agregar(email, rol) {
        const [resultado] = await pool.query(
            'INSERT INTO correos_permitidos (email, rol) VALUES (?, ?)',
            [email, rol || 'empleado']
        );
        return { id: resultado.insertId, email, rol: rol || 'empleado' };
    }

    static async eliminar(email) {
        const [resultado] = await pool.query('DELETE FROM correos_permitidos WHERE email = ?', [email]);
        return resultado.affectedRows > 0;
    }
}

module.exports = CorreoPermitidoModel;