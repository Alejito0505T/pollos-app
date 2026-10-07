async function cargarProveedoresEnSelect() {
    const { datos: proveedores } = await ProveedorService.listar();
    const select = document.getElementById('select-proveedor');
    select.innerHTML = '<option value="">Sin proveedor</option>' +
        proveedores.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
}

async function cargarCompras() {
    const { datos: compras } = await InventarioService.listar();
    const tbody = document.getElementById('tabla-compras');
    tbody.innerHTML = compras.slice(0, 20).map(c => {
        const costoUnitario = (c.costo_total && c.cantidad_pollos) ? (c.costo_total / c.cantidad_pollos) : null;
        return `
            <tr>
                <td>${new Date(c.fecha_ingreso).toLocaleDateString()}</td>
                <td>${c.proveedor_nombre || '—'}</td>
                <td>${c.cantidad_pollos}</td>
                <td>${c.costo_total ? '$' + Number(c.costo_total).toLocaleString() : '—'}</td>
                <td>${costoUnitario ? '$' + Math.round(costoUnitario).toLocaleString() : '—'}</td>
                <td>
                    <button type="button" class="btn-eliminar" onclick="eliminarCompra(${c.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function eliminarCompra(id) {
    confirmarAccion('¿Eliminar esta compra? Esta acción no se puede deshacer.', async () => {
        try {
            await InventarioService.eliminar(id);
            mostrarAlerta('Compra eliminada.', 'exito');
            cargarCompras();
        } catch (error) {
            mostrarAlerta(error.message, 'error');
        }
    });
}

function actualizarPreviewCompra() {
    const cantidad = parseFloat(document.getElementById('input-cantidad').value) || 0;
    const costoUnitario = parseFloat(document.getElementById('input-costo-unitario').value) || 0;
    const precioVenta = parseFloat(document.getElementById('input-precio-venta').value) || 0;
    const preview = document.getElementById('compra-preview');
    if (cantidad > 0 && costoUnitario > 0) {
        const costoTotal = costoUnitario * cantidad;
        let texto = `Costo total de la compra: $${costoTotal.toLocaleString()}`;
        if (precioVenta > 0) {
            const gananciaUnitaria = precioVenta - costoUnitario;
            const gananciaTotal = gananciaUnitaria * cantidad;
            texto += ` · Ganancia por pollo: $${gananciaUnitaria.toLocaleString()} · Ganancia total estimada: $${gananciaTotal.toLocaleString()}`;
        }
        preview.textContent = texto;
    } else {
        preview.textContent = '';
    }
}

document.getElementById('input-cantidad').addEventListener('input', actualizarPreviewCompra);
document.getElementById('input-costo-unitario').addEventListener('input', actualizarPreviewCompra);
document.getElementById('input-precio-venta').addEventListener('input', actualizarPreviewCompra);

document.getElementById('form-proveedor').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await ProveedorService.crear({
            nombre: document.getElementById('input-prov-nombre').value,
            telefono: document.getElementById('input-prov-telefono').value,
            precio_compra_lb: document.getElementById('input-prov-precio').value
        });
        mostrarAlerta('Proveedor agregado.', 'exito');
        e.target.reset();
        cargarProveedoresEnSelect();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
});

document.getElementById('form-compra').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const cantidad = Number(document.getElementById('input-cantidad').value);
        const costoUnitario = Number(document.getElementById('input-costo-unitario').value) || 0;

        if (costoUnitario <= 0) {
            mostrarAlerta('Debes ingresar el costo por pollo para poder calcular el total.', 'error');
            return;
        }

        await InventarioService.crear({
            proveedor_id: document.getElementById('select-proveedor').value || null,
            cantidad_pollos: cantidad,
            costo_total: costoUnitario * cantidad,
            fecha_ingreso: document.getElementById('input-fecha').value
        });
        mostrarAlerta('Compra registrada.', 'exito');
        e.target.reset();
        document.getElementById('input-fecha').value = new Date().toISOString().slice(0, 10);
        document.getElementById('compra-preview').textContent = '';
        cargarCompras();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
});

document.getElementById('input-fecha').value = new Date().toISOString().slice(0, 10);
cargarProveedoresEnSelect();
cargarCompras();