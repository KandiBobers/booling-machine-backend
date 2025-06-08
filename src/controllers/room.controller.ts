    import { Request, Response } from 'express';
    import * as roomModel from '../models/room.model';

    export const getRooms = async (req: Request, res: Response): Promise<void> => {
        try {
            const rooms = await roomModel.getAllRooms();
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };