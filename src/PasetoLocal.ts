import { IProtocol, SymmetricKey } from 'paseto.js';
import { PasetoEncryptionKey } from "./PasetoEncryptionKey";

const sSymmetricKey = Symbol('symmetricKey');

export class PasetoLocal<P extends IProtocol> extends PasetoEncryptionKey<P> {
    private readonly [sSymmetricKey]: SymmetricKey<P>;

    public constructor(version: P, key: SymmetricKey<P>) {
        super(version);
        this[sSymmetricKey] = key;
    }

    public async encrypt(message: string|Buffer|object, footer?: Buffer|string|object): Promise<string> {
        const sk = this[sSymmetricKey];

        const {message: normalisedMessage, footer: normalisedfooter} =
                this.messageAndFooterNormalization(message, footer);

        return this.pasetoVersion.encrypt(
            normalisedMessage,
            sk,
            normalisedfooter,
        );
    }

    public async decrypt(message: string, footer?: Buffer|string): Promise<string> {
        const sk = this[sSymmetricKey];
        return this.pasetoVersion.decrypt(message, sk, footer);
    }

    public localKey(): SymmetricKey<P>|undefined {
        return this[sSymmetricKey];
    }
}
