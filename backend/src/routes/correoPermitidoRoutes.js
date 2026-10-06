const express = require('express');
const router = express.Router();
const CorreoPermitidoController = require('../controllers/correoPermitidoController');
const { verificarToken, soloDueno } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, soloDueno, CorreoPermitidoController.listar);
router.post('/', verificarToken, soloDueno, CorreoPermitidoController.agregar);
router.delete('/:email', verificarToken, soloDueno, CorreoPermitidoController.eliminar);

module.exports = router;