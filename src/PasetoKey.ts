import { IProtocol } from 'paseto.js';

const sRepr = Symbol('repr');

export abstract class PasetoKey<P extends IProtocol> {
    protected readonly pasetoVersion: P;
    protected readonly [sRepr]: string;

    constructor(version: P) {
        this.pasetoVersion = version;
        this[sRepr] = version.repr();
    }

    public getRepr(): string {
        return this[sRepr];
    }
}
