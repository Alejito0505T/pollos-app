function alternarSidebar() {
    document.getElementById('sidebar').classList.toggle('abierto');
    document.getElementById('overlay-sidebar').classList.toggle('visible');
}

function cerrarSidebar() {
    document.getElementById('sidebar').classList.remove('abierto');
    document.getElementById('overlay-sidebar').classList.remove('visible');
}

function mostrarUsuarioSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const elementoNombre = document.getElementById('sidebar-usuario-nombre');
    if (usuario && elementoNombre) {
        elementoNombre.textContent = usuario.nombre;
    }

    const btnCerrarSesion = document.getElementById('sidebar-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = 'login.html';
        });
    }
}

mostrarUsuarioSesion();