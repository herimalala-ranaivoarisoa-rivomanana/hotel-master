const cloudinary = require('cloudinary').v2;

function client() {
    const names = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    if (names.some(name => !process.env[name] || !process.env[name].trim())) {
        const error = new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on the server.');
        error.statusCode = 503;
        throw error;
    }
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
    return cloudinary;
}

async function deleteImages(images = []) {
    const ids = images.map(image => image && image.public_id).filter(id => id && id !== 'default_avatar');
    if (!ids.length) return;
    const uploader = client().uploader;
    await Promise.all(ids.map(id => uploader.destroy(id)));
}

// Cleanup must not turn a successful database write into a failed request.
async function cleanupImages(images) {
    try { await deleteImages(images); }
    catch (_) { console.error('Cloudinary image cleanup failed; retry cleanup of unused images.'); }
}

async function uploadImages(images, options) {
    if (!Array.isArray(images) || !images.length || images.some(image =>
        typeof image !== 'string' || !/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(image))) {
        const error = new Error('Please provide images in JPEG, PNG, WebP or GIF format.');
        error.statusCode = 400;
        throw error;
    }
    const uploaded = [];
    try {
        const uploader = client().uploader;
        for (const image of images) {
            const result = await uploader.upload(image, { ...options, resource_type: 'image' });
            uploaded.push({ public_id: result.public_id, url: result.secure_url });
        }
        return uploaded;
    } catch (error) {
        await cleanupImages(uploaded);
        throw error;
    }
}

module.exports = { uploadImages, deleteImages, cleanupImages };
