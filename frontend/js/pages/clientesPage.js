async function cargarClientes() {
    const { datos: clientes } = await ClienteService.listar();
    const tbody = document.getElementById('tabla-clientes');
    tbody.innerHTML = clientes.map(c => `
        <tr>
            <td>${c.nombre}</td>
            <td>${c.telefono || '-'}</td>
            <td>${c.email || '-'}</td>
            <td><button class="btn" style="background:var(--color-peligro)" onclick="eliminarCliente(${c.id})">Eliminar</button></td>
        </tr>
    `).join('');
}

async function eliminarCliente(id) {
    const confirmado = await confirmarAccion('¿Eliminar este cliente?');
    if (!confirmado) return;

    try {
        await ClienteService.eliminar(id);
        mostrarAlerta('Cliente eliminado.', 'exito');
        cargarClientes(); // o la función que recarga la lista, usa el nombre real que tengas
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
}

document.getElementById('form-cliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await ClienteService.crear({
            nombre: document.getElementById('input-nombre').value,
            telefono: document.getElementById('input-telefono').value,
            email: document.getElementById('input-email').value
        });
        mostrarAlerta('Cliente registrado.', 'exito');
        e.target.reset();
        cargarClientes();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
});

cargarClientes();