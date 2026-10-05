const { body, validationResult } = require('express-validator');

const reglasAbono = [
    body('monto')
        .notEmpty().withMessage('El monto del abono es obligatorio.')
        .isFloat({ min: 1 }).withMessage('El monto debe ser mayor a 0.')
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

module.exports = { reglasAbono, validar };