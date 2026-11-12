import nc from 'next-connect'
import dbConnect from '../../config/dbConnect'

import { webhookCheckout } from '../../controllers/paymentControllers'

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

export const config = {
    api: {
        bodyParser: false,
    }
}

handler.post(webhookCheckout)

export default handler;