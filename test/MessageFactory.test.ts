import * as assert from 'assert';
import { Duration } from '../src/Duration';
import { MessageFactory } from '../src/MessageFactory';
import { MessageValidator } from '../src/MessageValidator';

describe('MessageFactory', () => {
    it ('Can create message', async () => {
        const messageFactory = new MessageFactory();
        const message = messageFactory.createMessage({ hello: 'world' });
        assert.strictEqual(message.hello, 'world');
        assert.deepStrictEqual(Object.keys(message), ['hello']);
    });

    it ('Can set a token duration to the factory', async () => {
        const messageFactory = new MessageFactory({ duration: new Duration(3) });
        const message = messageFactory.createMessage({ hello: 'world' });
        assert.strictEqual(message.hello, 'world');
        const d = new Date();
        d.setFullYear(d.getFullYear() + 3);
        d.setMilliseconds((message.exp as Date).getMilliseconds());
        assert.strictEqual((message.exp as Date).getTime(), d.getTime());
        assert.deepStrictEqual(Object.keys(message).sort(), ['exp', 'hello']);
        assert.deepStrictEqual(Object.keys(message).sort(), ['exp', 'hello']);
        assert.ok(new MessageValidator(message).isValid());
    });

    it ('Can set a token expiration date to the factory', async () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 3);
        const messageFactory = new MessageFactory({ expiration: d });
        const message = messageFactory.createMessage({ hello: 'world' });
        assert.strictEqual(message.hello, 'world');
        assert.strictEqual((message.exp as Date).getTime(), d.getTime());
        assert.deepStrictEqual(Object.keys(message).sort(), ['exp', 'hello']);
        assert.ok(new MessageValidator(message).isValid());
    });
});
