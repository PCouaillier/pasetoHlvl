import { IProtocol, PublicKey } from 'paseto.js';

const sPasetoVersion = Symbol('pasetoInstance');
const sPublicKey = Symbol('publicKey');

export default class PasetoPublic<P extends IProtocol> {

    private readonly [sPasetoVersion]: P;
    private readonly [sPublicKey]: PublicKey<P>;

    public constructor(pasetoVersion: P, publicKey: PublicKey<P>) {
        this[sPasetoVersion] = pasetoVersion;
        this[sPublicKey] = publicKey;
    }

    public publicKey(): PublicKey<P> {
        return this[sPublicKey];
    }

    public async verify(message: string): Promise<string> {
        return this[sPasetoVersion].verify(message, this[sPublicKey]);
    }
}
