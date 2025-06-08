import { Request, Response } from 'express';
import * as userModel from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';

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
                message: 'User already exists',
                username: existingUser.username,
                password: existingUser.password,
                user_id: existingUser.id
            });
            return;
        }

        const username = `user_${uuidv4().substring(0, 8)}`;
        const password = generatePassword();

        const newUser = await userModel.createUser(username, telegram_id, password);

        res.status(201).json({
            message: 'User created successfully',
            credentials: {
                username,
                password, // Возвращаем plain text пароль только один раз!
                user_id: newUser.id
            }
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