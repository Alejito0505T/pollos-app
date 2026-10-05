const express = require('express');
const router = express.Router();
const FiadoController = require('../controllers/fiadoController');
const { reglasAbono, validar } = require('../middlewares/abonoValidator');
const { verificarToken, soloDueno } = require('../middlewares/authMiddleware');

router.get('/', FiadoController.listarPendientes);
router.get('/cartera', verificarToken, soloDueno, FiadoController.cartera);
router.post('/:id/abonos', reglasAbono, validar, FiadoController.abonar);

module.exports = router;