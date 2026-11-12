import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect'

import { allAdminBookings } from '../../../../controllers/bookingControllers'

import onError from '../../../../middlewares/errors'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

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
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(allAdminBookings)

export default handler;