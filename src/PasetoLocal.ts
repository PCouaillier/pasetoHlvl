import { IProtocol, SymmetricKey } from 'paseto.js';
import { PasetoKey } from './PasetoKey';

const sSymmetricKey = Symbol('symmetricKey');

export class PasetoLocal<P extends IProtocol> extends PasetoKey<P> {
    private readonly [sSymmetricKey]?: SymmetricKey<P>;

    public constructor(version: P, key: SymmetricKey<P>) {
        super(version);
        this[sSymmetricKey] = key;
    }

    public async encrypt(message: string|Buffer): Promise<string> {
        const sk = this[sSymmetricKey];
        if (!sk) {
            throw new Error('No local key');
        }
        return this.pasetoVersion.encrypt(message, sk);
    }

    public async decrypt(message: string) {
        const sk = this[sSymmetricKey];
        if (!sk) {
            throw new Error('No local key');
        }
        return this.pasetoVersion.decrypt(message, sk);
    }

    public localKey(): SymmetricKey<P>|undefined {
        return this[sSymmetricKey];
    }
}
