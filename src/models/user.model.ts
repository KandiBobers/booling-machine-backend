import pool from '../config/database';
import logger from "../utils/logger";

export interface User {
    id: number;
    username: string;
    telegram_id: string;
    password?: string;
    role: string;
}

export const createUser = async (username: string, telegram_id: string, password: string): Promise<User> => {
    const result = await pool.query(
        'INSERT INTO users (username, telegram_id, password) VALUES ($1, $2, $3) RETURNING id, username, telegram_id',
        [username, telegram_id, password]
    );
    return result.rows[0];
};

export const getUserByTelegramId = async (telegram_id: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegram_id]);
    return result.rows[0] || null;
};

// В src/models/user.model.ts
export const getUserById = async (id: number): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
};

export const verifyUserCredentials = async (username: string, password: string): Promise<User | null> => {
    const user = await getUserByUsername(username);
    if (!user || !user.password) return null;

    const isValid = (password == user.password);
    return isValid ? user : null;
};

export const findUserByTelegramId = async (telegram_id: string): Promise<User | null> => {
    const user = await getUserByTelegramId(telegram_id);
    if (!user) return null;
    return user;
}

const adminExists = async (): Promise<boolean> => {
    const result = await pool.query('SELECT 1 FROM users WHERE id = 228');
    return result.rows.length > 0; // Проверяем, есть ли хотя бы одна строка
};

export const createAdmin = async (): Promise<void> => {
    const adminExist = await adminExists()
    if (!adminExist) {
        await pool.query(`
            INSERT INTO users(id, username, password, telegram_id, role) VALUES
                (228, 'admin', 'admin', '-', 'ADMIN')
        `);
        logger.info('Admin created');
    }
};

