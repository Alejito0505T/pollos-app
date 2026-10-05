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
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
        await ClienteService.eliminar(id);
        cargarClientes();
    } catch (error) {
        alert('Error: ' + error.message);
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
        alert('Cliente registrado.');
        e.target.reset();
        cargarClientes();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

cargarClientes();