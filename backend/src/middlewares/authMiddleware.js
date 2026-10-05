const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado.' });
    }
    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado.' });
    }
}

function soloDueno(req, res, next) {
    if (req.usuario.rol !== 'dueno') {
        return res.status(403).json({ ok: false, mensaje: 'No tienes permiso para esta acción.' });
    }
    next();
}

module.exports = { verificarToken, soloDueno };