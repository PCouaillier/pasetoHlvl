import { expect } from 'chai';
import { PasetoLocal, PasetoPrivate, PasetoPublic } from '../src/PasetoHlvl';
import { addInstanceFactory, getInstance } from '../src/PasetoInitiator';

describe('PasetoInitiator', () => {
    addInstanceFactory('local', async (factory) => ({
        local: await factory.getLocalKey(),
        private: await factory.getPrivateKey(),
    }));

    addInstanceFactory('private', async (factory) => ({
        private: await factory.getPrivateKey(),
    }));

    it('can handle multiple init calls', async () => {
        let i = 0;
        const cb = <P>(a: P) => { i += 1; return a; };
        const results = await Promise.all([
        getInstance('local')
            .then(cb),
        getInstance('local')
            .then(cb),
        getInstance('local')
            .then(cb),
        ]);
        expect(results[0].local).instanceOf(PasetoLocal);
        expect(results[0]).to.deep.equals(results[1]);
        expect(results[1]).to.deep.equals(results[2]);

        expect(i).to.deep.equal(3);
    });

    it('create the public key from a private one', async () => {
        let i = 0;
        const cb = <P>(a: P) => { i += 1; return a; };
        const results = await Promise.all([
        getInstance('local')
            .then(cb),
        getInstance('private')
            .then(cb),
        ]);
        expect(results[0].local).instanceOf(PasetoLocal);
        expect(results[1].private).instanceOf(PasetoPrivate);
        expect(results[1].public).instanceOf(PasetoPublic);
        expect(results[0].private!.privateKey().raw())
            .to.not.deep.equal(results[1].private!.privateKey().raw());

        expect(i).to.deep.equal(2);
    });
});
