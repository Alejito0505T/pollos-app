function alternarSidebar() {
    document.getElementById('sidebar').classList.toggle('abierto');
    document.getElementById('overlay-sidebar').classList.toggle('visible');
}

function cerrarSidebar() {
    document.getElementById('sidebar').classList.remove('abierto');
    document.getElementById('overlay-sidebar').classList.remove('visible');
}