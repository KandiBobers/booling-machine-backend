import * as roomModel from '../models/room.model';
import * as bookingModel from '../models/booking.model';
import * as userModel from '../models/user.model';
import logger from '../utils/logger';

class BookingService {
    async bookRoom(roomId: number, date: string, userId: number) {
        try {
            // Проверка существования комнаты
            const room = await roomModel.getRoomById(roomId);
            if (!room) {
                logger.warn(`Room not found: ${roomId}`);
                return { status: 404, message: 'Room not found' };
            }

            // Проверка доступности даты
            const isAvailable = await bookingModel.isDateAvailable(roomId, date);
            if (!isAvailable) {
                logger.warn(`Date already booked: ${date} for room ${roomId}`);
                return { status: 228, message: 'Date already booked' };
            }

            // Создание брони
            await bookingModel.createBooking(roomId, userId, date);
            logger.info(`Booking created: room ${roomId} on ${date} by user ${userId}`);
            return { status: 200, message: 'Booking created successfully' };
        } catch (error) {
            logger.error('Error booking room:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    async getUserBookings(userId: number) {
        try {
            const user = await userModel.getUserById(userId);

            // Проверка принадлежности пользователю
            if (user?.role == "ADMIN") return await bookingModel.getAllBokings()

            return await bookingModel.getUserBookings(userId);
        } catch (error) {
            logger.error('Error getting user bookings:', error);
            throw error;
        }
    }


    async removeBooking(bookingId: number, userId: number) {
        try {
            // Проверка существования бронирования
            const booking = await bookingModel.getBookingById(bookingId);
            if (!booking) {
                logger.warn(`Booking not found: ${bookingId}`);
                return { status: 404, message: 'Booking not found' };
            }

            const user = await userModel.getUserById(userId);

            // Проверка принадлежности пользователю
            if (booking.user_id !== userId && user?.role !== "ADMIN") {
                logger.warn(`User ${userId} tried to delete booking ${bookingId} of user ${booking.user_id}`);
                return { status: 403, message: 'Forbidden' };
            }

            // Удаление бронирования
            await bookingModel.deleteBooking(bookingId);
            logger.info(`Booking deleted: ${bookingId} by user ${userId}`);
            return { status: 200, message: 'Booking deleted successfully' };
        } catch (error) {
            logger.error('Error removing booking:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    async updateBooking(fromDate: String, userId: number, toDate: string) {
        try {
            const booking = await bookingModel.getBookingByDate(fromDate);
            if (!booking) {
                return { status: 404, message: 'Booking not found' };
            }

            const user = await userModel.getUserById(userId);

            if (booking.user_id !== userId && user?.role !== "ADMIN") {
                return { status: 403, message: 'Forbidden' };
            }

            const isAvailable = await bookingModel.isDateAvailable(booking.room_id, toDate);
            if (!isAvailable) {
                return { status: 228, message: 'New date is already booked' };
            }

            await bookingModel.updateBookingDate(fromDate, toDate);
            return { status: 200, message: 'Booking updated successfully' };
        } catch (error) {
            logger.error('Error updating booking:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
}

export default new BookingService();