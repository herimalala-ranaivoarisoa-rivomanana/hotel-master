import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect'

import { getSingleRoom, updateRoom, deleteRoom } from '../../../controllers/roomControllers'

import onError from '../../../middlewares/errors'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const handler = nc({ onError });

handler.use(async (req, res, next) => {
    try {
        await dbConnect();
        return next();
    } catch (error) {
        return next(error);
    }
});

handler.get(getSingleRoom)

handler
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateRoom)

handler
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteRoom)

export default handler;

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
