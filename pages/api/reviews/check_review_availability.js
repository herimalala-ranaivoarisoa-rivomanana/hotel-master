import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect'

import { checkReviewAvailability } from '../../../controllers/roomControllers'

import onError from '../../../middlewares/errors'
import { isAuthenticatedUser } from '../../../middlewares/auth'

const handler = nc({ onError });

handler.use(async (req, res, next) => {
    try {
        await dbConnect();
        return next();
    } catch (error) {
        return next(error);
    }
});

handler
    .use(isAuthenticatedUser)
    .get(checkReviewAvailability)

export default handler;