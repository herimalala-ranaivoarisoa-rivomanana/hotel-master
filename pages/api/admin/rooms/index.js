import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect'

import { allAdminRooms } from '../../../../controllers/roomControllers'

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
    .get(allAdminRooms)

export default handler;