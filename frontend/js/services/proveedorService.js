const ProveedorService = {
    async listar() { return apiRequest('/proveedores', 'GET'); },
    async crear(datos) { return apiRequest('/proveedores', 'POST', datos); }
};