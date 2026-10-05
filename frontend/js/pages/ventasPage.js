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
            <td>${v.cliente_nombre}</td>
            <td>${v.peso_lb} lb</td>
            <td>$${Number(v.precio_lb).toLocaleString()}</td>
            <td>$${Number(v.total).toLocaleString()}</td>
            <td>${v.es_fiado ? '<span class="badge badge-pendiente">Fiado</span>' : 'Contado'}</td>
            <td><button type="button" class="btn-editar" onclick="iniciarEdicion(${v.id}, ${v.cliente_id}, ${v.peso_lb}, ${v.precio_lb})">Editar</button></td>
        </tr>
    `).join('');
}

function iniciarEdicion(id, clienteId, peso, precio) {
    editandoId = id;
    document.getElementById('select-cliente').value = clienteId;
    document.querySelector('input[name="modo-venta"][value="libra"]').checked = true;
    document.getElementById('campos-libra').style.display = 'block';
    document.getElementById('campos-directo').style.display = 'none';
    document.getElementById('input-peso').value = peso;
    document.getElementById('input-precio').value = precio;
    actualizarPreview();

    const boton = document.querySelector('#form-venta button[type="submit"]');
    boton.textContent = 'Guardar cambios';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

        if (editandoId) {
            await VentaService.actualizar(editandoId, datosVenta);
            mostrarAlerta('Venta actualizada.', 'exito');
            editandoId = null;
            document.querySelector('#form-venta button[type="submit"]').textContent = 'Registrar venta';
        } else {
            await VentaService.crear(datosVenta);
            mostrarAlerta('Venta registrada correctamente.', 'exito');
        }

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