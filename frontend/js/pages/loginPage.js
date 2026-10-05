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