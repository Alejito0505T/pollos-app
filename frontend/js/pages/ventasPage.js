let editandoId = null;

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
            <td>${new Date(v.fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>${v.cliente_nombre}</td>
            <td>${v.peso_lb} lb</td>
            <td>$${Number(v.precio_lb).toLocaleString()}</td>
            <td>$${Number(v.total).toLocaleString()}</td>
            <td>${v.es_fiado ? '<span class="badge badge-pendiente">Fiado</span>' : 'Contado'}</td>
            <td>
                <div class="acciones-tabla">
                    <button type="button" class="btn-editar" onclick='abrirModalEditar(${v.id}, ${v.cliente_id}, ${v.peso_lb}, ${v.precio_lb}, "${v.fecha}")'>Editar</button>
                    <button type="button" class="btn-editar btn-eliminar" onclick="eliminarVenta(${v.id})">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function eliminarVenta(id) {
    const confirmado = await confirmarAccion('¿Eliminar esta venta? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    try {
        await VentaService.eliminar(id);
        mostrarAlerta('Venta eliminada.', 'exito');
        cargarVentasRecientes();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
}

function formatearFechaInput(fechaISO) {
    const d = new Date(fechaISO);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function abrirModalEditar(id, clienteId, peso, precio, fecha) {
    editandoId = id;
    const selectEdit = document.getElementById('edit-cliente');
    selectEdit.innerHTML = document.getElementById('select-cliente').innerHTML;
    selectEdit.value = clienteId;
    document.getElementById('edit-fecha').value = formatearFechaInput(fecha);

    const esDirecto = Number(peso) === 1;
    document.querySelector(`input[name="edit-modo-venta"][value="${esDirecto ? 'directo' : 'libra'}"]`).checked = true;
    document.getElementById('edit-campos-libra').style.display = esDirecto ? 'none' : 'block';
    document.getElementById('edit-campos-directo').style.display = esDirecto ? 'block' : 'none';

    if (esDirecto) {
        document.getElementById('edit-precio-total').value = precio;
    } else {
        document.getElementById('edit-peso').value = peso;
        document.getElementById('edit-precio').value = precio;
    }

    document.getElementById('modal-editar-overlay').style.display = 'flex';
}

function cerrarModalEditar() {
    document.getElementById('modal-editar-overlay').style.display = 'none';
    editandoId = null;
}

document.querySelectorAll('input[name="edit-modo-venta"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const esDirecto = document.querySelector('input[name="edit-modo-venta"]:checked').value === 'directo';
        document.getElementById('edit-campos-libra').style.display = esDirecto ? 'none' : 'block';
        document.getElementById('edit-campos-directo').style.display = esDirecto ? 'block' : 'none';
    });
});

document.getElementById('form-editar-venta').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const modo = document.querySelector('input[name="edit-modo-venta"]:checked').value;
        const fechaInput = document.getElementById('edit-fecha').value.replace('T', ' ') + ':00';
        let datos;

        if (modo === 'directo') {
            datos = {
                cliente_id: document.getElementById('edit-cliente').value,
                peso_lb: 1,
                precio_lb: document.getElementById('edit-precio-total').value,
                fecha: fechaInput
            };
        } else {
            datos = {
                cliente_id: document.getElementById('edit-cliente').value,
                peso_lb: document.getElementById('edit-peso').value,
                precio_lb: document.getElementById('edit-precio').value,
                fecha: fechaInput
            };
        }

        await VentaService.actualizar(editandoId, datos);
        mostrarAlerta('Venta actualizada.', 'exito');
        cerrarModalEditar();
        cargarVentasRecientes();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
});

function actualizarPreview() {
    const modo = document.querySelector('input[name="modo-venta"]:checked').value;
    let total = 0;
    if (modo === 'directo') {
        total = parseFloat(document.getElementById('input-precio-total').value) || 0;
    } else {
        const peso = parseFloat(document.getElementById('input-peso').value) || 0;
        const precio = parseFloat(document.getElementById('input-precio').value) || 0;
        total = peso * precio;
    }
    document.getElementById('total-preview').textContent = total > 0 ? `Total: $${total.toLocaleString()}` : '';
}

document.getElementById('input-peso').addEventListener('input', actualizarPreview);
document.getElementById('input-precio').addEventListener('input', actualizarPreview);
document.getElementById('input-precio-total').addEventListener('input', actualizarPreview);

document.querySelectorAll('input[name="modo-venta"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const esDirecto = document.querySelector('input[name="modo-venta"]:checked').value === 'directo';
        document.getElementById('campos-libra').style.display = esDirecto ? 'none' : 'block';
        document.getElementById('campos-directo').style.display = esDirecto ? 'block' : 'none';
        actualizarPreview();
    });
});

document.getElementById('form-venta').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const modo = document.querySelector('input[name="modo-venta"]:checked').value;
        let datosVenta;

        if (modo === 'directo') {
            datosVenta = {
                cliente_id: document.getElementById('select-cliente').value,
                peso_lb: 1,
                precio_lb: document.getElementById('input-precio-total').value,
                es_fiado: document.getElementById('input-fiado').checked
            };
        } else {
            datosVenta = {
                cliente_id: document.getElementById('select-cliente').value,
                peso_lb: document.getElementById('input-peso').value,
                precio_lb: document.getElementById('input-precio').value,
                es_fiado: document.getElementById('input-fiado').checked
            };
        }

        await VentaService.crear(datosVenta);
        mostrarAlerta('Venta registrada correctamente.', 'exito');
        e.target.reset();
        document.getElementById('total-preview').textContent = '';
        document.getElementById('campos-libra').style.display = 'block';
        document.getElementById('campos-directo').style.display = 'none';
        cargarVentasRecientes();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
});

cargarClientesEnSelect();
cargarVentasRecientes();