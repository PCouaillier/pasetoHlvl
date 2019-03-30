import { IProtocol } from 'paseto.js';
import { PasetoKey } from './PasetoKey';

type MessageType = Buffer|string|object;

export abstract class PasetoEncryptionKey<P extends IProtocol> extends PasetoKey<P> {

    protected static messageAndFooterNormalization(message: MessageType, footer?: MessageType): {
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

    public abstract async encrypt(message: MessageType, footer?: MessageType): Promise<string>;
    public abstract async decrypt(message: MessageType, footer?: MessageType): Promise<string>;
}
