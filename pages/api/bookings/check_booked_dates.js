import nc from 'next-connect';
import dbConnect from '../../../config/dbConnect'

import { checkBookedDatesOfRoom } from '../../../controllers/bookingControllers';

import onError from '../../../middlewares/errors';

const handler = nc({ onError });

handler.use(async (req, res, next) => {
    try {
        await dbConnect();
        return next();
    } catch (error) {
        return next(error);
    }
});

handler.get(checkBookedDatesOfRoom);

export default handler;