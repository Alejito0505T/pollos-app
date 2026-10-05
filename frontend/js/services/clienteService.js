const ClienteService = {
    listar: () => apiRequest('/clientes'),
    crear: (datos) => apiRequest('/clientes', 'POST', datos),
    eliminar: (id) => apiRequest(`/clientes/${id}`, 'DELETE')
};