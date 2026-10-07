async function cargarDashboard() {
    try {
        const { datos: ventas } = await VentaService.listar();
        const { datos: cartera } = await FiadoService.cartera();
        const { datos: stockInfo } = await apiRequest('/inventario/stock');

        const hoy = new Date().toISOString().slice(0, 10);
        const ventasHoy = ventas.filter(v => v.fecha.slice(0, 10) === hoy);
        const totalHoy = ventasHoy
            .filter(v => !v.es_fiado)
            .reduce((suma, v) => suma + Number(v.total), 0);
        const deudaTotal = cartera.reduce((suma, c) => suma + Number(c.deuda_total), 0);

        document.getElementById('stat-ventas-hoy').textContent = ventasHoy.length;
        document.getElementById('stat-total-hoy').textContent = `$${totalHoy.toLocaleString()}`;
        document.getElementById('stat-stock').textContent = stockInfo.stock_disponible;
        document.getElementById('stat-cartera').textContent = `$${deudaTotal.toLocaleString()}`;

        const tbody = document.getElementById('tabla-ventas');
        tbody.innerHTML = ventas.slice(0, 10).map(v => `
            <tr>
                <td>${v.cliente_nombre}</td>
                <td>${v.peso_lb}</td>
                <td>$${Number(v.total).toLocaleString()}</td>
                <td>${new Date(v.fecha).toLocaleDateString()}</td>
                <td>${v.es_fiado ? '<span class="badge badge-pendiente">Fiado</span>' : '<span class="badge badge-pagado">Contado</span>'}</td>
                <td><button type="button" class="btn-editar" style="background:#dc2626;" onclick="eliminarVenta(${v.id})">Eliminar</button></td>
            </tr>
        `).join('');
    } catch (error) {
        mostrarAlerta('Error cargando el dashboard: ' + error.message, 'error');
    }
}

async function eliminarVenta(id) {
    const confirmado = await confirmarAccion('¿Eliminar esta venta? Esta acción no se puede deshacer.');
    if (!confirmado) return;

    try {
        await VentaService.eliminar(id);
        mostrarAlerta('Venta eliminada.', 'exito');
        cargarDashboard();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
}

cargarDashboard();