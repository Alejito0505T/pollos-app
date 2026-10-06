const VentaService = {
    async listar() {
        return apiRequest('/ventas', 'GET');
    },
    async crear(datos) {
        return apiRequest('/ventas', 'POST', datos);
    },
    async actualizar(id, datos) {
        return apiRequest(`/ventas/${id}`, 'PUT', datos);
    },
    async eliminar(id) {
        return apiRequest(`/ventas/${id}`, 'DELETE');
    }
};