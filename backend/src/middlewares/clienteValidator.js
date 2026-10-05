const { body, validationResult } = require('express-validator');

const reglasCliente = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

    body('telefono')
        .optional({ checkFalsy: true })
        .isLength({ min: 7, max: 20 }).withMessage('El teléfono no es válido.'),

    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('El email no tiene un formato válido.')
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

module.exports = { reglasCliente, validar };