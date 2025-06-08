import { Router } from 'express';
import * as roomController from '../controllers/room.controller';
import * as bookingController from '../controllers/booking.controller';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/get-credentials', userController.generateCredentials)
router.get('/get-rooms', roomController.getRooms); //Получить все книги
router.get('/get-booked', bookingController.getUserBookings);
router.post('/book', bookingController.bookRoom);
router.delete('/remove', bookingController.removeBooking);
router.put('/edit', bookingController.updateBooking);
router.post('/login', userController.login)


export default router;