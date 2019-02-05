import * as assert from 'assert';
import {V2} from 'paseto.js';
import Paseto, {Usage} from '../src/paseto';

describe('paseto', () => {
    it('signs', async () => {
        const paseto = await Paseto.createInstance({usage: Usage.public});
        const crypted = await paseto.sign('Hello world');
        assert.strictEqual(
            await paseto.verify(crypted),
            'Hello world',
        );
    });

    it('encrypt', async () => {
        const paseto = await Paseto.createInstance({usage: Usage.local});
        const crypted = await paseto.encrypt('Hello world');
        const localKey = paseto.localKey();
        assert.ok(localKey !== undefined);
        if (localKey) {
            assert.notStrictEqual(localKey.encode(), 'DL/1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG+NsZvM5VCc=');
        }
        assert.strictEqual(
            await paseto.decrypt(crypted),
            'Hello world',
        );
    });

    it('encrypt with defined key', async () => {
        const arbitraryLocalKey = 'DL_1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG-NsZvM5VCc';
        const arbitraryKey = Buffer.from(arbitraryLocalKey, 'base64');
        const paseto = await Paseto.createInstance<V2>({usage: Usage.local, localKey: arbitraryKey});
        const crypted = await paseto.encrypt('Hello world');
        const localKey = paseto.localKey();
        assert.ok(localKey !== undefined);
        if (localKey) {
            assert.strictEqual(localKey.encode(), arbitraryLocalKey);
        }
        assert.strictEqual(crypted, 'v2.local.snNO9ndrvEHuGrWPeX_CUBnThcT36rgy2YN1r25aVn428nZ4UwDr3IaJFVLTYa99mFLe');
        assert.strictEqual(await paseto.decrypt(crypted), 'Hello world');
    });
});
