const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function load(mongoose, env = { DB_URI: 'mongodb://example.test/hotel' }) {
    const context = { mongoose, process: { env }, global: {} };
    const source = fs.readFileSync('config/dbConnect.js', 'utf8')
        .replace("import mongoose from 'mongoose';", '')
        .replace('export default dbConnect;', 'global.connect = dbConnect;');
    vm.runInNewContext(source, context);
    return context.global.connect;
}
test('missing DB_URI fails before issuing a database query', async () => {
    const connect = load({ connect: () => assert.fail('must not connect') }, {});
    await assert.rejects(connect(), error => error.statusCode === 503 && error.message.includes('DB_URI'));
});
test('concurrent requests share an in-flight connection with bounded waits', async () => {
    let calls = 0, resolve;
    const pending = new Promise(done => { resolve = done; });
    const mongoose = { connection: { readyState: 0 }, connect: (uri, options) => {
        calls++;
        assert.equal(options.serverSelectionTimeoutMS, 4000);
        assert.equal(options.bufferCommands, false);
        return pending;
    } };
    const connect = load(mongoose);
    const first = connect(), second = connect();
    assert.equal(calls, 1);
    resolve(mongoose);
    await Promise.all([first, second]);
});
test('failed connection is sanitized and a later request can retry', async () => {
    let calls = 0;
    const connect = load({ connection: { readyState: 0 }, connect: () => {
        calls++;
        return Promise.reject(new Error('secret URI must not be returned'));
    } });
    for (let i = 0; i < 2; i++) {
        await assert.rejects(connect(), error => error.statusCode === 503 && !error.message.includes('secret URI'));
    }
    assert.equal(calls, 2);
});
test('connected serverless instances reuse their existing connection', async () => {
    const mongoose = { connection: { readyState: 1 }, connect: () => assert.fail('must reuse') };
    assert.equal(await load(mongoose)(), mongoose);
});
