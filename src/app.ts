import express from 'express';
import router from './routes/api.routes';
import logger from './utils/logger';
import morgan from 'morgan';
import { authenticateUser } from './middleware/auth'; // Добавлено

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Подключение роутов с аутентификацией
app.use("", authenticateUser, router); // Изменено

// Health check (без аутентификации)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;