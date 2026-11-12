import dbConnect from '../config/dbConnect'
import Room from '../models/room'
import APIFeatures from '../utils/apiFeatures'

export async function getRoomsData(query = {}) {
    await dbConnect();
    const resPerPage = 4;
    const features = new APIFeatures(Room.find(), query).search().filter();
    const [roomsCount, filteredRoomsCount, rooms] = await Promise.all([
        Room.countDocuments().maxTimeMS(2000),
        features.query.clone().countDocuments().maxTimeMS(2000),
        features.pagination(resPerPage).query.maxTimeMS(2000).lean()
    ]);
    return { roomsCount, resPerPage, filteredRoomsCount, rooms };
}

export async function getRoomData(id) {
    await dbConnect();
    return Room.findById(id).maxTimeMS(2000).lean();
}

export function roomLoadError(error) {
    return error.statusCode === 503 ? error.message : 'Rooms are temporarily unavailable. Please try again later.';
}
