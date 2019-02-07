import { IProtocol, PrivateKey, PublicKey } from 'paseto.js';
import PasetoKey from './PasetoKey';
import PasetoPublic from './PasetoPublic';

const sPrivateKey = Symbol('privateKey');
const sPublicKey = Symbol('publicKey');
const sHasPublicKey = Symbol('hasPublicKey');

export default class PasetoPrivate<P extends IProtocol> extends PasetoKey<P> {
    private readonly [sPrivateKey]: PrivateKey<P>;
    private readonly [sPublicKey]?: PasetoPublic<P>;
    private readonly [sHasPublicKey]: boolean;

    public constructor(pasetoVersion: P, privateKey: PrivateKey<P>, publicKey?: PublicKey<P>) {
        super(pasetoVersion);
        this[sPrivateKey] = privateKey;
        this[sPublicKey] = publicKey ? new PasetoPublic(pasetoVersion, publicKey) : undefined;
        this[sHasPublicKey] = publicKey !== undefined;
    }

    /**
     * Encode a message using an asymmetric authentication
     *
     * @param message the prefered way is by using a buffer
     * @returns the encoded message
     */
    public async sign(message: Buffer|string): Promise<string> {
        return this.pasetoVersion.sign(message, this[sPrivateKey]);
    }

    public privateKey(): PrivateKey<P> {
        return this[sPrivateKey];
    }

    /**
     * @returns if it can use a public key
     */
    public hasPublicKey(): boolean {
        return this[sHasPublicKey];
    }

    public publicKey(): undefined|PublicKey<P> {
        const pub = this[sPublicKey];
        return pub ? pub.publicKey() : undefined;
    }

    /**
     * verify and decode an asymmetric authentication token
     *
     * @see {@link hasPublicKey}
     * @param token
     * @returns the decoded token or undefined
     */
    public verify(token: string): undefined|Promise<string> {
        const pub = this[sPublicKey];
        return pub ? pub.verify(token) : undefined;
    }
}
