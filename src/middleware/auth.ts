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

    // 1. Проверяем авторизацию через username/password (из заголовков)
    const username = req.headers['xui-web-nigol'];
    const password = req.headers['xui-web-drowssap'];

    if (!username || !password) {
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