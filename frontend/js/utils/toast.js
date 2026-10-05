function mostrarAlerta(mensaje, tipo = 'exito') {
    const contenedor = document.getElementById('toast-contenedor') || crearContenedor();
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(() => toast.classList.add('mostrar'), 10);
    setTimeout(() => {
        toast.classList.remove('mostrar');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function crearContenedor() {
    const div = document.createElement('div');
    div.id = 'toast-contenedor';
    document.body.appendChild(div);
    return div;
}