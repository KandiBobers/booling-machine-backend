import { Request, Response } from 'express';
import bookingService from '../services/booking.service';
import { AuthenticatedRequest } from '../middleware/auth';

export const bookRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { room_id, date } = req.body;
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
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error getting user bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { booking_id } = req.body;
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
    const { booking_id, new_date } = req.body;
    const userId = req.user?.id;

    if (!booking_id || !new_date || !userId) {
        res.status(400).json({ message: 'Missing parameters' });
        return;
    }

    const result = await bookingService.updateBooking(
        parseInt(booking_id as string),
        userId,
        new_date as string
    );

    res.status(result.status).json({ message: result.message });
};

