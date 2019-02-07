import { IProtocol, PrivateKey, PublicKey } from 'paseto.js';
import PasetoKey from './PasetoKey';
import PasetoPublic from './PasetoPublic';

const sPrivateKey = Symbol('privateKey');
const sPublicKey = Symbol('publicKey');

export default class PasetoPrivate<P extends IProtocol> extends PasetoKey<P> {
    private readonly [sPrivateKey]: PrivateKey<P>;
    private readonly [sPublicKey]?: PasetoPublic<P>;

    public constructor(pasetoVersion: P, privateKey: PrivateKey<P>, publicKey?: PublicKey<P>) {
        super(pasetoVersion);
        this[sPrivateKey] = privateKey;
        this[sPublicKey] = publicKey ? new PasetoPublic(pasetoVersion, publicKey) : undefined;
    }

    public async sign(message: string|Buffer): Promise<string> {
        return this.pasetoVersion.sign(message, this[sPrivateKey]);
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
