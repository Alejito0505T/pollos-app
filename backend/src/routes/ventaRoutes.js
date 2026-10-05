const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');
const { reglasVenta, validar } = require('../middlewares/ventaValidator');

router.get('/', VentaController.listar);
router.post('/', reglasVenta, validar, VentaController.crear);

module.exports = router;