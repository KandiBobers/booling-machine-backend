import { Request, Response, NextFunction } from 'express';
import * as userModel from '../models/user.model';
import logger from '../utils/logger';

// Расширяем Request, чтобы TypeScript знал о поле user
export interface AuthenticatedRequest extends Request {
    user?: userModel.User;
}

const PUBLIC_PATHS = ['/get-credentials'];

export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Пропускаем публичные пути
    if (PUBLIC_PATHS.includes(req.path)) {
        return next();
    }

    logger.info("trying to auth")

    // 1. Проверяем авторизацию через username/password (из заголовков)
    const username = req.headers['xui-web-nigol'];
    const password = req.headers['xui-web-drowssap'];

    if (!username || !password) {
        if(req.path == '/get-booked') {
            logger.info("trying to book for telegram")
            const telegram_id = req.headers['xui-telegram-token'];
            if(!telegram_id) {
                logger.info("not found telegram id")
                res.status(401).send({error: 'Authentication headers are missing (telegram also)'})}
            else {
                const user = await userModel.findUserByTelegramId(telegram_id as string);
                if (!user) {
                    res.status(401).json({ error: 'Invalid credentials' });
                    return;
                }

                // Записываем пользователя в req.user
                req.user = user;
                return next();
            }
        }
        res.status(401).json({ error: 'Authentication headers are missing' });
        return;
    }

    try {
        const user = await userModel.verifyUserCredentials(username as string, password as string);

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Записываем пользователя в req.user
        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};