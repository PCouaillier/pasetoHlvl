import { IProtocol, PrivateKey, PublicKey, SymmetricKey, V1, V2 } from 'paseto.js';

export enum Usage {
    local = 'local',
    public = 'public',
}

export enum Version {
    v1 = 'v1',
    v2 = 'v2',
}

export interface IPasetoOptions {
    localKey?: Buffer;
    privateKey?: Buffer;
    publicKey?: Buffer;
    usage?: Usage;
    version?: Version;
}

interface IPasetoConstructorOptions<P extends IProtocol> {
    privateKey?: PrivateKey<P>;
    publicKey?: PublicKey<P>;
    symmetricKey?: SymmetricKey<P>;
    usage?: Usage;
    version: P;
}

const sUsage = Symbol('usage');
const sPasetoInstance = Symbol('pasetoInstance');
const sPrivateKey = Symbol('privateKey');
const sPublicKey = Symbol('publicKey');
const sSymmetricKey = Symbol('symmetricKey');

export default class Paseto<P extends IProtocol> {

    public static async createInstance<P extends IProtocol>(
            pasetoOptions?: IPasetoOptions,
        ): Promise<Paseto<P>> {

        if (!pasetoOptions) {
            pasetoOptions = {};
        }

        const paseto: IPasetoConstructorOptions<P> = {
            version: Paseto.getVersion<P>(pasetoOptions),
        };
        const jobs = new Array<Promise<void>>();
        if (pasetoOptions.usage === undefined || pasetoOptions.usage === 'public') {
            if (pasetoOptions.privateKey) {
                const pk = new PrivateKey(paseto.version);
                paseto.privateKey = pk;
                jobs.push(pk.inject(pasetoOptions.privateKey));
            } else {
                jobs.push(paseto.version.private().then(async (sk: PrivateKey<P>) => {
                    paseto.privateKey = sk;
                    paseto.publicKey = await sk.public();
                }));
            }
        }

        if (pasetoOptions.usage === undefined || pasetoOptions.usage === 'local') {
            if (pasetoOptions.localKey) {
                const localKey = new SymmetricKey(paseto.version);
                paseto.symmetricKey = localKey;
                jobs.push(localKey.inject(pasetoOptions.localKey));
            } else {
                jobs.push(paseto.version.symmetric().then((sk: any) => {
                    paseto.symmetricKey = sk;
                }));
            }
        }
        if (jobs.length > 0) {
            await Promise.all(jobs);
        }
        return new Paseto(paseto);
    }

    private static getVersion<P extends IProtocol>(pasetoOptions?: IPasetoOptions): P {
        const version = pasetoOptions ? pasetoOptions.version : undefined;
        switch (version) {
            case Version.v1:
                return new V1() as P;
            case undefined:
            case Version.v2:
                return new V2() as P;
            default:
                throw new Error('Argument Error version not implement');
        }
    }

    private readonly [sUsage]: Usage;
    private readonly [sPasetoInstance]: P;
    private readonly [sPrivateKey]?: PrivateKey<P>;
    private readonly [sPublicKey]?: PublicKey<P>;
    private readonly [sSymmetricKey]?: SymmetricKey<P>;

    protected constructor(pasetoOptions: IPasetoConstructorOptions<P>) {
        this[sUsage] = pasetoOptions.usage || Usage.local;
        this[sPasetoInstance] = pasetoOptions.version;
        this[sPrivateKey] = pasetoOptions.privateKey;
        this[sPublicKey] = pasetoOptions.publicKey;
        this[sSymmetricKey] = pasetoOptions.symmetricKey;
    }

    public async encrypt(message: string|Buffer): Promise<string> {
        const sk = this[sSymmetricKey];
        if (!sk) {
            throw new Error('No local key');
        }
        return this[sPasetoInstance].encrypt(message, sk);
    }

    public async decrypt(message: string) {
        const sk = this[sSymmetricKey];
        if (!sk) {
            throw new Error('No local key');
        }
        return this[sPasetoInstance].decrypt(message, sk);
    }

    public async sign(message: string|Buffer) {
        const pk = this[sPrivateKey];
        if (!pk) {
            throw new Error('No private key');
        }
        return this[sPasetoInstance].sign(message, pk);
    }

    public localKey(): SymmetricKey<P>|undefined {
        return this[sSymmetricKey];
    }

    public publicKey(): PublicKey<P>|undefined {
        return this[sPublicKey];
    }

    public privateKey(): PrivateKey<P>|undefined {
        return this[sPrivateKey];
    }

    public async verify(message: string) {
        const pubK = this[sPublicKey];
        if (!pubK) {
            throw new Error('No private key');
        }
        return this[sPasetoInstance].verify(message, pubK);
    }
}
