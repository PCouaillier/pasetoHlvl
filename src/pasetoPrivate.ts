import { IProtocol, PrivateKey, PublicKey } from 'paseto.js';
import PasetoPublic from './PasetoPublic';

const sPasetoVersion = Symbol('pasetoInstance');
const sPrivateKey = Symbol('privateKey');
const sPublicKey = Symbol('publicKey');

export default class PasetoPrivate<P extends IProtocol> {

    private readonly [sPasetoVersion]: P;
    private readonly [sPrivateKey]: PrivateKey<P>;
    private readonly [sPublicKey]?: PasetoPublic<P>;

    public constructor(pasetoVersion: P, privateKey: PrivateKey<P>, publicKey?: PublicKey<P>) {
        this[sPasetoVersion] = pasetoVersion;
        this[sPrivateKey] = privateKey;
        this[sPublicKey] = publicKey ? new PasetoPublic(pasetoVersion, publicKey) : undefined;
    }

    public async sign(message: string|Buffer): Promise<string> {
        return this[sPasetoVersion].sign(message, this[sPrivateKey]);
    }

    public publicKey(): PublicKey<P>|undefined {
        const pub = this[sPublicKey];
        return pub ? pub.publicKey() : undefined;
    }

    public privateKey(): PrivateKey<P> {
        return this[sPrivateKey];
    }

    public async verify(message: string) {
        const pub = this[sPublicKey];
        return pub ? pub.verify(message) : undefined;
    }
}
