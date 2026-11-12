const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function load(file, dependencies) {
    const source = fs.readFileSync(file, 'utf8')
        .replace(/^import .*$/gm, '')
        .replace(/export \{([\s\S]*?)\}/, 'module.exports = {$1}');
    const context = {
        module: { exports: {} },
        catchAsyncErrors: fn => fn,
        ErrorHandler: class extends Error { constructor(message, statusCode) { super(message); this.statusCode = statusCode; } },
        ...dependencies
    };
    vm.runInNewContext(source, context);
    return context.module.exports;
}
const response = () => ({ status() { return this; }, json() {} });
const oldImage = { public_id: 'old', url: 'https://example.com/old' };
const newImage = { public_id: 'new', url: 'https://example.com/new' };

test('room upload failure leaves previous images and database untouched', async () => {
    const events = [];
    const { updateRoom } = load('controllers/roomControllers.js', {
        Room: { findById: async () => ({ images: [oldImage] }), findByIdAndUpdate: async () => events.push('save') },
        uploadImages: async () => { throw new Error('upload failed'); },
        cleanupImages: async () => events.push('cleanup')
    });
    await assert.rejects(updateRoom({ query: { id: 'room' }, body: { images: ['input'] } }, response()), /upload failed/);
    assert.deepEqual(events, []);
});
test('room database failure removes new images and preserves previous images', async () => {
    const cleaned = [];
    const { updateRoom } = load('controllers/roomControllers.js', {
        Room: { findById: async () => ({ images: [oldImage] }), findByIdAndUpdate: async () => { throw new Error('database failed'); } },
        uploadImages: async () => [newImage], cleanupImages: async images => cleaned.push(...images)
    });
    await assert.rejects(updateRoom({ query: { id: 'room' }, body: { images: ['input'] } }, response()), /database failed/);
    assert.deepEqual(cleaned, [newImage]);
});
test('successful room replacement saves before removing old images', async () => {
    const events = [];
    const { updateRoom } = load('controllers/roomControllers.js', {
        Room: { findById: async () => ({ images: [oldImage] }), findByIdAndUpdate: async () => { events.push('save'); return {}; } },
        uploadImages: async () => [newImage], cleanupImages: async images => events.push(images[0].public_id)
    });
    await updateRoom({ query: { id: 'room' }, body: { images: ['input'] } }, response());
    assert.deepEqual(events, ['save', 'old']);
});
test('profile changes without an avatar do not upload or delete images', async () => {
    let saved = false;
    const user = { avatar: oldImage, save: async () => { saved = true; } };
    const { updateProfile } = load('controllers/authControllers.js', {
        User: { findById: async () => user },
        uploadImages: async () => assert.fail('unexpected upload'),
        cleanupImages: async () => assert.fail('unexpected cleanup')
    });
    await updateProfile({ user: { _id: 'user' }, body: { name: 'Name', email: 'test@example.com' } }, response());
    assert.equal(saved, true);
    assert.equal(user.avatar, oldImage);
});
test('registration without an avatar uses the local default image', async () => {
    let created;
    const { registerUser } = load('controllers/authControllers.js', {
        User: { create: async data => { created = data; } },
        uploadImages: async () => assert.fail('unexpected upload')
    });
    await registerUser({ body: { name: 'Name', email: 'test@example.com', password: 'password' } }, response());
    assert.equal(created.avatar.url, '/images/default_avatar.jpg');
});
