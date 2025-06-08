import app from './app';
import dbService from './services/db.service';
import { initializeRooms } from './models/room.model';
import { createAdmin } from './models/user.model';
import logger from './utils/logger';


const PORT = process.env.PORT || 3000;
async function startServer() {

    logger.info('MODE:' + process.env.NODE_ENV);
    // Запуск миграций перед стартом сервера
    if (process.env.NODE_ENV === 'development') {
        await dbService.runMigrations();
    }
    await initializeRooms();
    await createAdmin();

    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

startServer().catch(err => {
    logger.error('Failed to start server:', err);
    process.exit(1);
});