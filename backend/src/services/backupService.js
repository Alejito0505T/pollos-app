const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

function hacerBackup() {
    const fecha = new Date().toISOString().slice(0, 10);
    const archivo = path.join(__dirname, '..', '..', 'backups', `pollos_backup_${fecha}.sql`);

    const comando = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > "${archivo}"`;

    exec(comando, (error) => {
        if (error) {
            console.error('Error haciendo backup:', error.message);
            return;
        }
        console.log(`Backup creado: ${archivo}`);
    });
}

module.exports = { hacerBackup };