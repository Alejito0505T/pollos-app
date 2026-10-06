async function cargarDashboard() {
    try {
        const { datos: ventas } = await VentaService.listar();
        const { datos: cartera } = await FiadoService.cartera();
        const { datos: stockInfo } = await apiRequest('/inventario/stock');

        const hoy = new Date().toISOString().slice(0, 10);
        const ventasHoy = ventas.filter(v => v.fecha.slice(0, 10) === hoy);
        const totalHoy = ventasHoy.reduce((suma, v) => suma + Number(v.total), 0);
        const deudaTotal = cartera.reduce((suma, c) => suma + Number(c.deuda_total), 0);

        document.getElementById('stat-ventas-hoy').textContent = ventasHoy.length;
        document.getElementById('stat-total-hoy').textContent = `$${totalHoy.toLocaleString()}`;
        document.getElementById('stat-stock').textContent = stockInfo.stock_disponible;
        document.getElementById('stat-cartera').textContent = `$${deudaTotal.toLocaleString()}`;

        const tbody = document.getElementById('tabla-ventas');
        tbody.innerHTML = ventas.slice(0, 10).map((v, i) => `
            <tr class="fila-venta" id="fila-${i}" onclick="alternarDetalle(${i})">
                <td><i class="fa-solid fa-chevron-right chevron"></i> ${v.cliente_nombre}</td>
                <td>${v.peso_lb}</td>
                <td>$${Number(v.total).toLocaleString()}</td>
                <td>${new Date(v.fecha).toLocaleDateString()}</td>
                <td><button type="button" class="btn-editar" style="background:#dc2626;" onclick="event.stopPropagation(); eliminarVenta(${v.id})">Eliminar</button></td>
            </tr>
            <tr class="fila-detalle" id="detalle-${i}">
                <td colspan="5">
                    <div class="detalle-contenido">
                        <p><i class="fa-solid fa-tag"></i> Precio por libra: $${Number(v.precio_lb).toLocaleString()}</p>
                        <p><i class="fa-solid fa-circle-info"></i> Tipo de venta: ${v.es_fiado ? 'Fiado' : 'Contado'}</p>
                        <p><i class="fa-solid fa-hashtag"></i> ID de venta: ${v.id}</p>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        mostrarAlerta('Error cargando el dashboard: ' + error.message, 'error');
    }
}

function alternarDetalle(i) {
    document.getElementById(`fila-${i}`).classList.toggle('abierta');
    document.getElementById(`detalle-${i}`).classList.toggle('abierta');
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