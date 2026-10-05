const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const { reglasInventario, validar } = require('../middlewares/inventarioValidator');

router.get('/', InventarioController.listar);
router.get('/stock', InventarioController.stock);
router.post('/', reglasInventario, validar, InventarioController.crear);

module.exports = router;