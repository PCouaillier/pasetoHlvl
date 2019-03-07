import { IProtocol, PrivateKey, PublicKey } from 'paseto.js';
import { PasetoEncryptionKey } from "./PasetoEncryptionKey";
import { PasetoPublic } from './PasetoPublic';

const sPrivateKey = Symbol('privateKey');
const sPublicKey = Symbol('publicKey');
const sHasPublicKey = Symbol('hasPublicKey');

export class PasetoPrivate<P extends IProtocol> extends PasetoEncryptionKey<P> {
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
    public async sign(message: Buffer|string, footer?: string|Buffer): Promise<string> {
        return this.pasetoVersion.sign(message, this[sPrivateKey], footer);
    }

    /**
     * Same as sign {@see PasetoPrivate.sign}
     *
     * @param message
     * @param footer
     */
    public async encrypt(message: Buffer|string, footer?: string|Buffer): Promise<string> {
        const {
            message: normalisedMessage,
            footer: normalisedFooter,
        } = this.messageAndFooterNormalization(message, footer);
        return this.sign(normalisedMessage, normalisedFooter);
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
    public verify(token: string, footer?: Buffer|string): undefined|Promise<string> {
        const pub = this[sPublicKey];
        return pub ? pub.verify(token, footer) : undefined;
    }

    /**
     * Same as verify but always return a Promise
     *
     * @param token
     * @param footer
     */
    public async decrypt(token: string, footer?: Buffer|string): Promise<string> {
        return this.verify(token, footer) || Promise.reject(new Error('NO_PUBLIC_KEY'));
    }
}
