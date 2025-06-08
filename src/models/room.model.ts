import pool from '../config/database';
import logger from '../utils/logger';

export interface Room {
    id: number;
    name: string;
    photo_url: string;
}

export const getAllRooms = async (): Promise<Room[]> => {
    const result = await pool.query('SELECT id, name, photo_url FROM rooms');
    return result.rows;
};

export const getRoomById = async (id: number): Promise<Room | null> => {
    const result = await pool.query('SELECT id, name, photo_url FROM rooms WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const hasRooms = async (): Promise<boolean> => {
    const result = await pool.query('SELECT COUNT(*) FROM rooms');
    return parseInt(result.rows[0].count, 10) > 0;
};

export const initializeRooms = async (): Promise<void> => {
    const roomsExist = await hasRooms();
    if (!roomsExist) {
        await pool.query(`
            INSERT INTO rooms (id, name, photo_url) VALUES
            (1, 'Конференц-зал "Олимп"', 'https://images.unsplash.com/photo-1571624436279-b272aff752b5'),
            (2, 'Переговорная "Афина"', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36'),
            (3, 'Коворкинг "Кодекс"', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2'),
            (4, 'Зал для презентаций "Парнас"', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678'),
            (5, 'Малый конференц-зал "Гермес"', 'https://images.unsplash.com/photo-1552581234-26160f608093'),
            (6, 'Тренинг-центр "Академия"', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018'),
            (7, 'Бизнес-лаунж "Зевс"', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'),
            (8, 'Креативная комната "Муза"', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'),
            (9, 'Студия для вебинаров "Студия 9"', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b'),
            (10, 'VIP-переговорная "Акрополь"', 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24')
        `);
        logger.info('Initial rooms data inserted');
    }
};