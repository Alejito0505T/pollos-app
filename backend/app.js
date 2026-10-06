require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        nombre: 'API Pollos - Sistema de Ventas',
        version: '1.0.0'
    });
});

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const clienteRoutes = require('./src/routes/clienteRoutes');
app.use('/api/clientes', clienteRoutes);

const proveedorRoutes = require('./src/routes/proveedorRoutes');
app.use('/api/proveedores', proveedorRoutes);

const inventarioRoutes = require('./src/routes/inventarioRoutes');
app.use('/api/inventario', inventarioRoutes);

const ventaRoutes = require('./src/routes/ventaRoutes');
app.use('/api/ventas', ventaRoutes);

const fiadoRoutes = require('./src/routes/fiadoRoutes');
app.use('/api/fiados', fiadoRoutes);

const correoPermitidoRoutes = require('./src/routes/correoPermitidoRoutes');
app.use('/api/correos-permitidos', correoPermitidoRoutes);

app.use((req, res) => {
    res.status(404).json({ ok: false, mensaje: `La ruta "${req.method} ${req.path}" no existe.` });
});

app.use(errorHandler);

const iniciarTareasProgramadas = require('./src/scheduler');
iniciarTareasProgramadas();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));