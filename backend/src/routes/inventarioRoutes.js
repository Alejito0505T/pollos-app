const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const { reglasInventario, validar } = require('../middlewares/inventarioValidator');
const { verificarToken, soloDueno } = require('../middlewares/authMiddleware');

router.get('/', InventarioController.listar);
router.get('/stock', InventarioController.stock);
router.post('/', reglasInventario, validar, InventarioController.crear);
router.delete('/:id', verificarToken, soloDueno, InventarioController.eliminar);

module.exports = router;