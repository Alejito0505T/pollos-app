const { body, validationResult } = require('express-validator');

const reglasInventario = [
    body('cantidad_pollos')
        .notEmpty().withMessage('La cantidad de pollos es obligatoria.')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0.'),

    body('fecha_ingreso')
        .notEmpty().withMessage('La fecha de ingreso es obligatoria.')
        .isDate().withMessage('La fecha no es válida (formato YYYY-MM-DD).')
];

function validar(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error de validación.',
            errores: errores.array().map(e => ({ campo: e.path, mensaje: e.msg }))
        });
    }
    next();
}

module.exports = { reglasInventario, validar };