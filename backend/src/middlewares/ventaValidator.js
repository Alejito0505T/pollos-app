const { body, validationResult } = require('express-validator');

const reglasVenta = [
    body('cliente_id')
        .notEmpty().withMessage('El cliente es obligatorio.')
        .isInt({ min: 1 }).withMessage('cliente_id debe ser un número válido.'),

    body('peso_lb')
        .notEmpty().withMessage('El peso en libras es obligatorio.')
        .isFloat({ min: 0.1 }).withMessage('El peso debe ser mayor a 0.'),

    body('precio_lb')
        .notEmpty().withMessage('El precio por libra es obligatorio.')
        .isFloat({ min: 0.1 }).withMessage('El precio debe ser mayor a 0.'),

    body('es_fiado')
        .optional()
        .isBoolean().withMessage('es_fiado debe ser true o false.')
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

module.exports = { reglasVenta, validar };