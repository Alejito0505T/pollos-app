const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedorController');
const { reglasProveedor, validar } = require('../middlewares/proveedorValidator');
const { verificarToken, soloDueno } = require('../middlewares/authMiddleware');

router.get('/', ProveedorController.listar);
router.get('/:id', ProveedorController.obtenerUno);
router.post('/', reglasProveedor, validar, ProveedorController.crear);
router.put('/:id', reglasProveedor, validar, ProveedorController.actualizar);
router.delete('/:id', verificarToken, soloDueno, ProveedorController.eliminar);

module.exports = router;