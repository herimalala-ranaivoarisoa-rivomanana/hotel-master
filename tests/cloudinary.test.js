const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const sdk = require('cloudinary').v2;
const { uploadImages, deleteImages } = require('../utils/cloudinary');
const image = 'data:image/png;base64,aGVsbG8=';
let destroyed;
beforeEach(() => {
    for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) process.env[key] = 'test';
    destroyed = [];
    sdk.uploader.destroy = async id => { destroyed.push(id); };
});
test('rejects missing server configuration before contacting Cloudinary', async () => {
    delete process.env.CLOUDINARY_API_SECRET;
    await assert.rejects(uploadImages([image], {}), { statusCode: 503 });
});
test('rejects empty, malformed and remote image inputs', async () => {
    for (const input of [undefined, [], 'image', ['https://example.com/a.jpg'], [null]]) {
        await assert.rejects(uploadImages(input, {}), { statusCode: 400 });
    }
});
test('configures v2 independently and returns HTTPS image references', async () => {
    sdk.uploader.upload = async (input, options) => {
        assert.equal(input, image);
        assert.equal(options.resource_type, 'image');
        assert.equal(options.folder, 'bookit/rooms');
        assert.equal(sdk.config().cloud_name, 'test');
        return { public_id: 'new', secure_url: 'https://example.com/new.png' };
    };
    assert.deepEqual(await uploadImages([image], { folder: 'bookit/rooms' }), [{ public_id: 'new', url: 'https://example.com/new.png' }]);
});
test('rolls back earlier uploads when a later upload fails', async () => {
    let count = 0;
    sdk.uploader.upload = async () => {
        if (++count === 2) throw new Error('upload failed');
        return { public_id: 'partial', secure_url: 'https://example.com/image' };
    };
    await assert.rejects(uploadImages([image, image], {}), /upload failed/);
    assert.deepEqual(destroyed, ['partial']);
});
test('does not send the local default avatar to Cloudinary for deletion', async () => {
    delete process.env.CLOUDINARY_API_SECRET;
    await deleteImages([{ public_id: 'default_avatar' }]);
    assert.deepEqual(destroyed, []);
});
