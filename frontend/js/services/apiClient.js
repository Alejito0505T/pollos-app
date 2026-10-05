const API_URL = 'https://pollos-app.onrender.com/api';

async function apiRequest(endpoint, metodo = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    };
    if (body) opciones.body = JSON.stringify(body);

    const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error en la petición.');
    }
    return datos;
}