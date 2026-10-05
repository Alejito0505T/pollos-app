const FiadoService = {
    listarPendientes: () => apiRequest('/fiados'),
    cartera: () => apiRequest('/fiados/cartera'),
    abonar: (id, monto) => apiRequest(`/fiados/${id}/abonos`, 'POST', { monto })
};