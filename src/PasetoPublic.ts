import { IProtocol, PublicKey } from 'paseto.js';
import { PasetoKey } from './PasetoKey';

const sPublicKey = Symbol('publicKey');

export class PasetoPublic<P extends IProtocol> extends PasetoKey<P> {
    private readonly [sPublicKey]: PublicKey<P>;

    public constructor(pasetoVersion: P, publicKey: PublicKey<P>) {
        super(pasetoVersion);
        this[sPublicKey] = publicKey;
    }

    public publicKey(): PublicKey<P> {
        return this[sPublicKey];
    }

    /**
     * verify and decode an asymmetric authentication
     *
     * @param token
     * @returns the decoded token
     */
    public async verify(token: string, footer?: Buffer|string): Promise<string> {
        return this.pasetoVersion.verify(token, this[sPublicKey], footer);
    }
}
