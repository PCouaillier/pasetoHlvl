import { IProtocol, PrivateKey, PublicKey, SymmetricKey} from 'paseto.js';

interface IPasetoConstructorOptions<P extends IProtocol> {
    privateKey?: PrivateKey<P>;
    publicKey?: PublicKey<P>;
    symmetricKey?: SymmetricKey<P>;
    version: P;
}

const sPasetoVersion = Symbol('pasetoVersion');
const sSymmetricKey = Symbol('symmetricKey');

export default class PasetoLocal<P extends IProtocol> {
    private readonly [sPasetoVersion]: P;
    private readonly [sSymmetricKey]?: SymmetricKey<P>;

    public constructor(version: P, key: SymmetricKey<P>) {
        this[sPasetoVersion] = version;
        this[sSymmetricKey] = key;
    }

    public async encrypt(message: string|Buffer): Promise<string> {
        const sk = this[sSymmetricKey];
        if (!sk) {
            throw new Error('No local key');
        }
        return this[sPasetoVersion].encrypt(message, sk);
    }

    public async decrypt(message: string) {
        const sk = this[sSymmetricKey];
        if (!sk) {
            throw new Error('No local key');
        }
        return this[sPasetoVersion].decrypt(message, sk);
    }

    public localKey(): SymmetricKey<P>|undefined {
        return this[sSymmetricKey];
    }
}
