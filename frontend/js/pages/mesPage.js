async function cargarMes() {
    const mesStr = document.getElementById('input-mes').value;
    if (!mesStr) return;

    const [anio, mes] = mesStr.split('-').map(Number);
    const inicio = new Date(anio, mes - 1, 1, 0, 0, 0);
    const fin = new Date(anio, mes, 0, 23, 59, 59);

    const { datos: ventas } = await VentaService.listar();

    const filtradas = ventas.filter(v => {
        const f = new Date(v.fecha);
        return f >= inicio && f <= fin;
    });

    let totalDinero = 0;
    let totalFiado = 0;
    filtradas.forEach(v => {
        totalDinero += Number(v.total);
        if (v.es_fiado) totalFiado += Number(v.total);
    });

    document.getElementById('m-total-ventas').textContent = filtradas.length;
    document.getElementById('m-total-dinero').textContent = `$${totalDinero.toLocaleString()}`;
    document.getElementById('m-total-fiado').textContent = `$${totalFiado.toLocaleString()}`;

    const tbody = document.getElementById('tabla-mes');
    tbody.innerHTML = filtradas.map(v => `
        <tr>
            <td>${new Date(v.fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>${v.cliente_nombre}</td>
            <td>${v.peso_lb} lb</td>
            <td>$${Number(v.precio_lb).toLocaleString()}</td>
            <td>$${Number(v.total).toLocaleString()}</td>
            <td>${v.es_fiado ? '<span class="badge badge-pendiente">Fiado</span>' : 'Contado'}</td>
        </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">Sin ventas este mes</td></tr>';
}

function fijarMesActual() {
    const hoy = new Date();
    const mesStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('input-mes').value = mesStr;
}

document.getElementById('input-mes').addEventListener('change', cargarMes);

fijarMesActual();
cargarMes();