import express from 'express';
import cors from 'cors'; // Добавлено
import router from './routes/api.routes';
import logger from './utils/logger';
import morgan from 'morgan';
import { authenticateUser } from './middleware/auth';

const app = express();

app.use(cors()); // Добавлено

// Middleware
app.use(express.json());
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Подключение роутов с аутентификацией
app.use("/api", authenticateUser, router);

// Health check (без аутентификации)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;