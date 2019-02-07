import { IProtocol, PrivateKey, PublicKey, SymmetricKey, V1, V2 } from 'paseto.js';
import PasetoLocal from './PasetoLocal';
import PasetoPrivate from './pasetoPrivate';
import PasetoPublic from './PasetoPublic';
import { PasetoVersion } from './PasetoVersion';

const sPasetoVersion = Symbol('pasetoVersion');

export class PasetoFactory<P extends IProtocol> {

    public static createInstance(version?: PasetoVersion.v1): PasetoFactory<V1>;
    public static createInstance(version?: PasetoVersion.v2): PasetoFactory<V2>;

    /** @ignore */
    public static createInstance<P extends IProtocol>(version?: PasetoVersion): PasetoFactory<P> {
        return new PasetoFactory(PasetoFactory.getVersion(version as any)) as PasetoFactory<P>;
    }

    public static getVersion(version: PasetoVersion.v1): V1;
    public static getVersion(version: PasetoVersion.v2): V2;

    /** @ignore */
    public static getVersion<V extends PasetoVersion>(version?: V): IProtocol {
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

    public constructor(version: P) {
        this[sPasetoVersion] = version;
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
