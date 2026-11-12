import nc from 'next-connect'
import dbConnect from '../../config/dbConnect'

import { currentUserProfile } from '../../controllers/authControllers'

import { isAuthenticatedUser } from '../../middlewares/auth'
import onError from '../../middlewares/errors'

const handler = nc({ onError });

handler.use(async (req, res, next) => {
    try {
        await dbConnect();
        return next();
    } catch (error) {
        return next(error);
    }
});

handler.use(isAuthenticatedUser).get(currentUserProfile)

export default handler;