const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UsuarioModel {

    static async obtenerPorEmail(email) {
        const [filas] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email]);
        return filas[0];
    }

    static async crear({ nombre, email, password, rol }) {
        const hash = await bcrypt.hash(password, 10);
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hash, rol || 'empleado']
        );
        return { id: resultado.insertId, nombre, email, rol: rol || 'empleado' };
    }

    static async compararPassword(passwordPlano, hash) {
        return bcrypt.compare(passwordPlano, hash);
    }
}

module.exports = UsuarioModel;