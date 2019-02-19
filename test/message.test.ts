import * as assert from 'assert';
import { Duration } from '../src/Duration';
import { MessageFactory } from '../src/MessageFactory';

describe('message', () => {
    it ('Can create message', async () => {
        const messageFactory = new MessageFactory();
        const message = messageFactory.createMessage({hello: 'world'});
        assert.strictEqual(message.hello, 'world');
        assert.deepStrictEqual(Object.keys(message), ['hello']);
    });

    it ('Can set a token dureation to the factory', async () => {
        const messageFactory = new MessageFactory({ duration: new Duration(3) });
        const message = messageFactory.createMessage({hello: 'world'});
        assert.strictEqual(message.hello, 'world');
        const d = new Date();
        d.setFullYear(d.getFullYear() + 3);
        d.setMilliseconds((message.exp as Date).getMilliseconds());
        assert.equal((message.exp as Date).getTime(), d.getTime());
        assert.deepEqual(Object.keys(message), ['hello', 'exp']);
    });
});
