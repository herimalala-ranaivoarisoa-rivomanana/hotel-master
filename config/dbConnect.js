import mongoose from 'mongoose';

// Reuse a single in-flight connection in warm serverless instances.
const cache = global.hotelDatabase || (global.hotelDatabase = { promise: null });

const unavailable = message => Object.assign(new Error(message), { statusCode: 503 });

const dbConnect = async () => {
    if (!process.env.DB_URI) {
        throw unavailable('Database is not configured. Set DB_URI in the deployment environment.');
    }
    if (mongoose.connection.readyState === 1) return mongoose;

    if (!cache.promise) {
        cache.promise = mongoose.connect(process.env.DB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 4000,
            connectTimeoutMS: 4000,
            socketTimeoutMS: 5000,
            maxPoolSize: 5
        });
    }
    try {
        return await cache.promise;
    } catch (_) {
        // Allow a later request to retry, without exposing URI/credentials.
        throw unavailable('Database connection unavailable. Check DB_URI and MongoDB Atlas network access.');
    } finally {
        cache.promise = null;
    }
};

export default dbConnect;
