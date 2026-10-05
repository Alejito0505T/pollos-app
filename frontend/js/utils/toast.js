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

function confirmarAccion(mensaje) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-confirmar">
                <p>${mensaje}</p>
                <div class="modal-botones">
                    <button class="btn-cancelar">Cancelar</button>
                    <button class="btn-confirmar">Eliminar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.btn-cancelar').onclick = () => {
            overlay.remove();
            resolve(false);
        };
        overlay.querySelector('.btn-confirmar').onclick = () => {
            overlay.remove();
            resolve(true);
        };
    });
}