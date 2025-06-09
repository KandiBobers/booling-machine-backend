import { Response } from 'express';
import bookingService from '../services/booking.service';
import { AuthenticatedRequest } from '../middleware/auth';

export const bookRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { room_id, date } = req.query;
    const userId = req.user?.id; // Берём ID из req.user

    if (!room_id || !date || !userId) {
        res.status(400).json({ message: 'Missing parameters' });
        return;
    }

    const result = await bookingService.bookRoom(
        parseInt(room_id as string),
        date as string,
        userId
    );

    res.status(result.status).json({ message: result.message });
};

export const getUserBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id; // Берём ID из req.user

    if (!userId) {
        res.status(400).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const bookings = await bookingService.getUserBookings(userId);

        // Преобразуем массив бронирований в нужный формат
        const formattedBookings = bookings.map(booking => ({
            id: booking.id, // ID комнаты или бронирования (уточните что вам нужно)
            name: booking.room_name, // название комнаты
            date: booking.date, // дата бронирования
            photo_url: booking.photo_url // URL фото комнаты
        }));

        res.status(200).json(formattedBookings);
    } catch (error) {
        console.error('Error getting user bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { booking_id } = req.query;
    const userId = req.user?.id; // Берём ID из req.user

    if (!booking_id || !userId) {
        res.status(400).json({ message: 'Missing parameters' });
        return;
    }

    const result = await bookingService.removeBooking(
        parseInt(booking_id as string),
        userId
    );

    res.status(result.status).json({ message: result.message });
};

export const updateBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { from_date, to_date } = req.query;
    const userId = req.user?.id;

    if (!from_date || !to_date || !userId) {
        res.status(400).json({ message: 'Missing parameters' });
        return;
    }

    const result = await bookingService.updateBooking(
        from_date as string,
        userId,
        to_date as string
    );

    res.status(result.status).json({ message: result.message });
};

