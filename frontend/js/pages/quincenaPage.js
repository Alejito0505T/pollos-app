function obtenerRangoQuincena(mesStr, quincena) {
    const [anio, mes] = mesStr.split('-').map(Number);
    let inicio, fin;
    if (quincena === '1') {
        inicio = new Date(anio, mes - 1, 1, 0, 0, 0);
        fin = new Date(anio, mes - 1, 15, 23, 59, 59);
    } else {
        inicio = new Date(anio, mes - 1, 16, 0, 0, 0);
        fin = new Date(anio, mes, 0, 23, 59, 59);
    }
    return { inicio, fin };
}

async function cargarQuincena() {
    const mesStr = document.getElementById('input-mes-quincena').value;
    const quincena = document.getElementById('select-quincena').value;
    if (!mesStr) return;

    const { inicio, fin } = obtenerRangoQuincena(mesStr, quincena);
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

    document.getElementById('q-total-ventas').textContent = filtradas.length;
    document.getElementById('q-total-dinero').textContent = `$${totalDinero.toLocaleString()}`;
    document.getElementById('q-total-fiado').textContent = `$${totalFiado.toLocaleString()}`;

    const tbody = document.getElementById('tabla-quincena');
    tbody.innerHTML = filtradas.map(v => `
        <tr>
            <td>${new Date(v.fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>${v.cliente_nombre}</td>
            <td>${v.peso_lb} lb</td>
            <td>$${Number(v.precio_lb).toLocaleString()}</td>
            <td>$${Number(v.total).toLocaleString()}</td>
            <td>${v.es_fiado ? '<span class="badge badge-pendiente">Fiado</span>' : 'Contado'}</td>
        </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">Sin ventas en esta quincena</td></tr>';
}

function fijarQuincenaActual() {
    const hoy = new Date();
    const mesStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('input-mes-quincena').value = mesStr;
    document.getElementById('select-quincena').value = hoy.getDate() <= 15 ? '1' : '2';
}

document.getElementById('input-mes-quincena').addEventListener('change', cargarQuincena);
document.getElementById('select-quincena').addEventListener('change', cargarQuincena);

fijarQuincenaActual();
cargarQuincena();