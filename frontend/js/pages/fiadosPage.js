async function cargarFiados() {
    const { datos: fiados } = await FiadoService.listarPendientes();
    const tbody = document.getElementById('tabla-fiados');

    const clasesBadge = { pendiente: 'badge-pendiente', vencido: 'badge-vencido', pagado: 'badge-pagado' };

    tbody.innerHTML = fiados.map(f => `
        <tr>
            <td>${f.cliente_nombre}</td>
            <td>$${Number(f.total).toLocaleString()}</td>
            <td>$${Number(f.total_abonado).toLocaleString()}</td>
            <td>$${Number(f.saldo_pendiente).toLocaleString()}</td>
            <td>${new Date(f.fecha_vencimiento).toLocaleDateString()}</td>
            <td><span class="badge ${clasesBadge[f.estado]}">${f.estado}</span></td>
            <td><button class="btn" onclick="registrarAbono(${f.fiado_id}, ${f.saldo_pendiente})">Abonar</button></td>
        </tr>
    `).join('');
}

async function registrarAbono(fiadoId, saldoPendiente) {
    const monto = prompt(`Saldo pendiente: $${Number(saldoPendiente).toLocaleString()}\n¿Cuánto va a abonar?`);
    if (!monto) return;
    try {
        await FiadoService.abonar(fiadoId, parseFloat(monto));
        alert('Abono registrado.');
        cargarFiados();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

cargarFiados();