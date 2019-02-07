import * as assert from 'assert';
import PasetoFactory from '../src/PasetoFactory';
import PasetoVersion from '../src/PasetoVersion';

const DEFAULT_VERSION = PasetoVersion.v2;

describe('paseto', () => {

    it ('has a fallback version', async () => {
        const paseto = await (PasetoFactory.createInstance()).getPrivateKey();
        const crypted = await paseto.sign('Hello world');
        assert.ok(paseto.hasPublicKey());
        assert.strictEqual(paseto.getRepr(), DEFAULT_VERSION);
        assert.strictEqual(
            await paseto.verify(crypted),
            'Hello world',
        );
    });

    it('signs', async () => {
        const paseto = await (PasetoFactory.createInstance(PasetoVersion.v2)).getPrivateKey();
        assert.ok(paseto.hasPublicKey());
        assert.strictEqual(paseto.getRepr(), PasetoVersion.v2);
        const crypted = await paseto.sign('Hello world');
        assert.strictEqual(
            await paseto.verify(crypted),
            'Hello world',
        );
    });

    it('can not verify if only the private key is given', async () => {
        const paseto = await
            (PasetoFactory.createInstance(PasetoVersion.v2))
                .getPrivateKey({
                    privateKey:
                        Buffer.from(
                            'i78VYCzrukpKsO7akXIMSt95swQ2ITG4M7SYZA44KSEqPX9zfXkyj8fjpPYqiGqyjePzuPb8ZCrJ9Qbt---Yyg',
                            'base64'),
                });

        assert.ok(!paseto.hasPublicKey());
        assert.strictEqual(paseto.getRepr(), PasetoVersion.v2);
        const crypted = await paseto.sign('Hello world');
        assert.notStrictEqual(crypted, undefined);
        assert.strictEqual(paseto.verify(crypted), undefined);
    });

    it('encrypt', async () => {
        const paseto = await (PasetoFactory.createInstance(PasetoVersion.v2)).getLocalKey();
        assert.strictEqual(paseto.getRepr(), PasetoVersion.v2);
        const crypted = await paseto.encrypt('Hello world');
        const localKey = paseto.localKey();
        assert.notStrictEqual(localKey, undefined);
        if (localKey) {
            assert.notStrictEqual(localKey.encode(), 'DL/1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG+NsZvM5VCc=');
        }
        assert.strictEqual(
            await paseto.decrypt(crypted),
            'Hello world',
        );
    });

    it('encrypt - V1', async () => {
        const paseto = await (PasetoFactory.createInstance(PasetoVersion.v1)).getLocalKey();
        assert.strictEqual(paseto.getRepr(), PasetoVersion.v1);
        const crypted = await paseto.encrypt('Hello world');
        const localKey = paseto.localKey();
        assert.notStrictEqual(localKey, undefined);
        if (localKey) {
            assert.notStrictEqual(localKey.encode(), 'AU3Ip3lR3xR0pqAd8NM524oWrpOAzdnlMs578LGq2B0');
        }
        assert.strictEqual(
            await paseto.decrypt(crypted),
            'Hello world',
        );
    });

    it('encrypt with defined key', async () => {
        const arbitraryLocalKey = 'DL_1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG-NsZvM5VCc';
        const arbitraryKey = Buffer.from(arbitraryLocalKey, 'base64');
        const paseto = await (PasetoFactory.createInstance(PasetoVersion.v2)).getLocalKey(arbitraryKey);
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
