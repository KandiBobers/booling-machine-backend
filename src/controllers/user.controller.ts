import { Request, Response } from 'express';
import * as userModel from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from "../utils/logger";

const generatePassword = (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

export const generateCredentials = async (req: Request, res: Response): Promise<void> => {
    const telegram_id = req.headers['xui-telegram-token'];

    if (!telegram_id || typeof telegram_id !== 'string') {
        res.status(400).json({ error: 'Telegram ID is required' });
        return;
    }

    try {
        const existingUser = await userModel.getUserByTelegramId(telegram_id);

        if (existingUser) {
            res.status(200).json({
                login: existingUser.username,
                password: existingUser.password,
            });
            return;
        }

        const username = `user_${uuidv4().substring(0, 8)}`;
        const password = generatePassword();

        const newUser = await userModel.createUser(username, telegram_id, password);

        res.status(201).json({
            login: username,
            password: password,
        });
    } catch (error) {
        console.error('Error in generateCredentials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        telegram_id: req.user.telegram_id
    });
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    logger.info("Проводится логин")
    res.status(200).json()
    return
}
