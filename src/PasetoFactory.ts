import { IProtocol, PrivateKey, PublicKey, SymmetricKey, V1, V2 } from 'paseto.js';
import { IPasetoVersionNameMap } from './IPasetoVersionNameMap';
import { PasetoLocal } from './PasetoLocal';
import { PasetoPrivate } from './pasetoPrivate';
import { PasetoPublic } from './PasetoPublic';
import { PasetoVersion } from './PasetoVersion';

const sPasetoVersion = Symbol('pasetoVersion');
const sRepr = Symbol('repr');

export class PasetoFactory<P extends IProtocol> {

    public static createInstance<V extends keyof IPasetoVersionNameMap>(version?: V):
            PasetoFactory<IPasetoVersionNameMap[V]> {
        return new PasetoFactory(PasetoFactory.getVersion(version));
    }

    public static getVersion<V extends keyof IPasetoVersionNameMap>(version?: V): IPasetoVersionNameMap[V] {
        switch (version) {
            case PasetoVersion.v1:
                return new V1();
            case undefined:
            case PasetoVersion.v2:
                return new V2();
            default:
                throw new Error('Argument Error version not implement');
        }
    }

    private readonly [sPasetoVersion]: P;
    private readonly [sRepr]: string;

    public constructor(version: P) {
        this[sRepr] = version.repr();
        this[sPasetoVersion] = version;
    }

    public getRepr(): string {
        return this[sRepr];
    }

    public async getPrivateKey(keys?: {privateKey: Buffer, publicKey?: Buffer}): Promise<PasetoPrivate<P>> {
        if (keys && keys.publicKey) {
            const pk = new PrivateKey(this[sPasetoVersion]);
            const pubKey = new PublicKey(this[sPasetoVersion]);
            await Promise.all([
                pk.inject(keys.privateKey),
                pubKey.inject(keys.publicKey),
            ]);
            return new PasetoPrivate(this[sPasetoVersion], pk, pubKey);
        }
        if (keys) {
            const pk = new PrivateKey(this[sPasetoVersion]);
            await pk.inject(keys.privateKey);
            return new PasetoPrivate(this[sPasetoVersion], pk);
        }
        const gPrivateKey = await this[sPasetoVersion].private();
        const gPublicKey = await gPrivateKey.public();

        return new PasetoPrivate(this[sPasetoVersion], gPrivateKey, gPublicKey);
    }

    public async getPublicKey(publicKey: Buffer): Promise<PasetoPublic<P>> {
        const gPublicKey = new SymmetricKey(this[sPasetoVersion]);
        await gPublicKey.inject(publicKey);
        return new PasetoPublic(this[sPasetoVersion], gPublicKey);
    }

    public async getLocalKey(localKey?: Buffer): Promise<PasetoLocal<P>> {
        if (localKey) {
            const gLocalKey = new SymmetricKey(this[sPasetoVersion]);
            await gLocalKey.inject(localKey);
            return new PasetoLocal(this[sPasetoVersion], gLocalKey);
        }
        return new PasetoLocal(this[sPasetoVersion], await this[sPasetoVersion].symmetric());
    }
}
