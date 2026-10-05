async function cargarClientesEnSelect() {
    const { datos: clientes } = await ClienteService.listar();
    const select = document.getElementById('select-cliente');
    select.innerHTML = clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

async function cargarVentasRecientes() {
    const { datos: ventas } = await VentaService.listar();
    const tbody = document.getElementById('tabla-ventas');
    tbody.innerHTML = ventas.slice(0, 15).map(v => `
        <tr>
            <td>${v.cliente_nombre}</td>
            <td>${v.peso_lb} lb</td>
            <td>$${Number(v.precio_lb).toLocaleString()}</td>
            <td>$${Number(v.total).toLocaleString()}</td>
            <td>${v.es_fiado ? '<span class="badge badge-pendiente">Fiado</span>' : 'Contado'}</td>
        </tr>
    `).join('');
}

function actualizarPreview() {
    const peso = parseFloat(document.getElementById('input-peso').value) || 0;
    const precio = parseFloat(document.getElementById('input-precio').value) || 0;
    document.getElementById('total-preview').textContent = `Total: $${(peso * precio).toLocaleString()}`;
}

document.getElementById('input-peso').addEventListener('input', actualizarPreview);
document.getElementById('input-precio').addEventListener('input', actualizarPreview);

document.getElementById('form-venta').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await VentaService.crear({
            cliente_id: document.getElementById('select-cliente').value,
            peso_lb: document.getElementById('input-peso').value,
            precio_lb: document.getElementById('input-precio').value,
            es_fiado: document.getElementById('input-fiado').checked
        });
        mostrarAlerta('Venta registrada correctamente.', 'exito');
        e.target.reset();
        document.getElementById('total-preview').textContent = '';
        cargarVentasRecientes();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
});

cargarClientesEnSelect();
cargarVentasRecientes();