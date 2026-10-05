const VentaService = {
    listar: () => apiRequest('/ventas'),
    crear: (datos) => apiRequest('/ventas', 'POST', datos)
};