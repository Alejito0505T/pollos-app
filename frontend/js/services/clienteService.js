const VentaService = {
    listar: () => apiRequest('/ventas'),
    crear: (datos) => apiRequest('/ventas', 'POST', datos),
    actualizar: (id, datos) => apiRequest(`/ventas/${id}`, 'PUT', datos)
};