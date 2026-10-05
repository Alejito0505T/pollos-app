const cron = require('node-cron');
const NotificacionesService = require('./services/notificacionesService');

function iniciarTareasProgramadas() {
    // Cada día a las 8:00 am: resumen diario
    cron.schedule('0 8 * * *', () => NotificacionesService.resumenDiario());

    // Cada día a las 9:00 am: revisar stock bajo
    cron.schedule('0 9 * * *', () => NotificacionesService.revisarStockBajo());

    // Cada día a las 9:00 am: revisar fiados por vencer
    cron.schedule('0 9 * * *', () => NotificacionesService.recordatorioFiados());

    const { hacerBackup } = require('./services/backupService');
    // ... dentro de iniciarTareasProgramadas():
    cron.schedule('0 23 * * *', () => hacerBackup()); // todos los días a las 11pm

    console.log('Tareas programadas iniciadas.');
}

module.exports = iniciarTareasProgramadas;