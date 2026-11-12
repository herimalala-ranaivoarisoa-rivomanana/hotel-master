import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect'

import { registerUser } from '../../../controllers/authControllers'

import onError from '../../../middlewares/errors'

const handler = nc({ onError });

dbConnect();

handler.post(registerUser)

export default handler;

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
