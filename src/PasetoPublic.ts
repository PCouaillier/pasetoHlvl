import { IProtocol, PublicKey } from 'paseto.js';
import PasetoKey from './PasetoKey';

const sPublicKey = Symbol('publicKey');

export default class PasetoPublic<P extends IProtocol> extends PasetoKey<P> {
    private readonly [sPublicKey]: PublicKey<P>;

    public constructor(pasetoVersion: P, publicKey: PublicKey<P>) {
        super(pasetoVersion);
        this[sPublicKey] = publicKey;
    }

    public publicKey(): PublicKey<P> {
        return this[sPublicKey];
    }

    public async verify(message: string): Promise<string> {
        return this.pasetoVersion.verify(message, this[sPublicKey]);
    }
}
