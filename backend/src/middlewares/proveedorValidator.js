const { body, validationResult } = require('express-validator');

const reglasProveedor = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre del proveedor es obligatorio.')
        .isLength({ min: 2, max: 100 }),

    body('precio_compra_lb')
        .notEmpty().withMessage('El precio de compra por libra es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor a 0.')
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

module.exports = { reglasProveedor, validar };