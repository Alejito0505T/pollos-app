document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const { datos } = await apiRequest('/auth/login', 'POST', {
            email: document.getElementById('input-email').value,
            password: document.getElementById('input-password').value
        });
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        window.location.href = 'index.html';
    } catch (error) {
        mostrarAlerta('Credenciales incorrectas.', 'error');
    }
});

async function manejarRespuestaGoogle(respuesta) {
    try {
        const { datos } = await apiRequest('/auth/google', 'POST', {
            credential: respuesta.credential
        });
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        window.location.href = 'index.html';
    } catch (error) {
        mostrarAlerta(error.message || 'No se pudo iniciar sesión con Google.', 'error');
    }
}

window.onload = () => {
    google.accounts.id.initialize({
        client_id: '357274690676-sbc8otj0dnhto1v13henigrhrmnn33jo.apps.googleusercontent.com',
        callback: manejarRespuestaGoogle
    });
    google.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        width: 336
    });
};