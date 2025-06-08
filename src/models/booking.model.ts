import pool from '../config/database';

export interface Booking {
    id: number;
    room_id: number;
    user_id: number;
    date: string;
    created_at: string;
    room_name?: string;
    photo_url?: string;
}

export interface FullBooking extends Booking {
    room_name: string;
    photo_url: string;
}

export const getUserBookings = async (userId: number): Promise<FullBooking[]> => {
    const query = `
        SELECT b.id, b.room_id, b.user_id, b.date, b.created_at,
               r.name AS room_name, r.photo_url
        FROM bookings b
                 JOIN rooms r ON b.room_id = r.id
        WHERE b.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const isDateAvailable = async (roomId: number, date: string): Promise<boolean> => {
    const query = 'SELECT id FROM bookings WHERE room_id = $1 AND date = $2';
    const result = await pool.query(query, [roomId, date]);
    return result.rows.length === 0;
};

export const createBooking = async (roomId: number, userId: number, date: string) => {
    await pool.query(
        'INSERT INTO bookings (room_id, user_id, date) VALUES ($1, $2, $3)',
        [roomId, userId, date]
    );
};

export const getBookingById = async (id: number): Promise<Booking | null> => {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const deleteBooking = async (id: number) => {
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
};

export const updateBookingDate = async (oldDate: String, newDate: string) => {
    await pool.query(
        'UPDATE bookings SET date = $1 WHERE date = $2',
        [newDate, oldDate]
    );
};

export const getBookingByDate = async (date: String): Promise<Booking | null> => {
    const result = await pool.query('SELECT * FROM bookings WHERE date = $1', [date]);
    return result.rows[0] || null;
};

export const getAllBokings = async () => {
    const result = await pool.query('SELECT * FROM bookings');
    return result.rows[0] || null;
}