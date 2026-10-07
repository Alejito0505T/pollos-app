const InventarioService = {
    async listar() { return apiRequest('/inventario', 'GET'); },
    async crear(datos) { return apiRequest('/inventario', 'POST', datos); },
    async stock() { return apiRequest('/inventario/stock', 'GET'); },
    async eliminar(id) { return apiRequest(`/inventario/${id}`, 'DELETE'); }
};