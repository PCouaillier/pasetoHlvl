import { IProtocol } from 'paseto.js';
import { PasetoKey } from './PasetoKey';
export abstract class PasetoEncryptionKey<P extends IProtocol> extends PasetoKey<P> {

    public abstract async encrypt(message: string | Buffer | object,
                                  footer?: Buffer | string | object): Promise<string>;
    public abstract async decrypt(message: string | Buffer | object,
                                  footer?: Buffer | string | object): Promise<string>;

    protected messageAndFooterNormalization(message: string | Buffer | object, footer?: Buffer | string | object): {
        message: string;
        footer?: string;
    } {
        if (message instanceof Object && (message as any).kid) {
            if (!footer) {
                footer = { kid: (message as any).kid };
            } else if (footer && !(footer as any).kid) {
                (footer as any).kid = (message as any).kid;
            }
        }
        return {
            footer: footer ? footer.toString() : undefined,
            message: message.toString(),
        };
    }
}
