import { Duration } from './Duration';

export interface  IStdMessageFactoryOptions {
    issuer?: string;
    subject?: string;
    audience?: string;
    notBefore?: Date;
    issuedAt?: Date;
    tokenIdentifier?: Date;
}

export interface IMessageFactoryOptionsWithExpiration extends IStdMessageFactoryOptions {
    expiration?: Date;
}

export interface IMessageFactoryOptionsWithDuration extends IStdMessageFactoryOptions {
    duration: Duration;
}

export type IMessageFactoryOptions = IMessageFactoryOptionsWithDuration|IMessageFactoryOptionsWithExpiration;

export interface  IMessageParameters {
    aud?: IMessageFactoryOptions['audience'];
    exp?: IMessageFactoryOptionsWithExpiration['expiration'];
    iat?: IMessageFactoryOptions['issuedAt'];
    iss?: IMessageFactoryOptions['issuer'];
    jti?: IMessageFactoryOptions['tokenIdentifier'];
    nbf?: IMessageFactoryOptions['notBefore'];
    sub?: IMessageFactoryOptions['subject'];
}

const ParamtersMaping =  Object.freeze({
    audience: 'aud',
    expiration: 'aud',
    issuedAt: 'iat',
    issuer: 'iss',
    notBefore: 'nbf',
    subject: 'sub',
    tokenIdentifier: 'jti',
});

export class MessageFactory {

    private static toMessageOptions(options?: IMessageFactoryOptions): IMessageParameters {
        if (!options) { return {}; }
        return Object.keys(options).reduce((acc: any, key: string) => {
            if (key !== 'duration') {
                acc[(ParamtersMaping as any)[key]] = (options as any)[key];
            }
            return acc as IMessageParameters;
        },
        {} as IMessageParameters);
    }
    private readonly options?: IMessageParameters;
    private readonly calculateExpiration?: () => Readonly<Date>;

    public constructor(options?: IMessageFactoryOptions) {
        if (options) {
            if ((options as IMessageFactoryOptionsWithDuration).duration) {
                const duration = (options as IMessageFactoryOptionsWithDuration).duration;
                this.calculateExpiration = () => duration.getExpiration();
            }
        }
        this.options = MessageFactory.toMessageOptions(options);
    }

    public createMessage<K extends object>(inputMessage: K): K&IMessageParameters {
        const message: any = {};
        const options = this.options;
        if (options) {
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    message[key] = (options as any)[key];
                }
            }
        }
        for (const key in inputMessage) {
            if (inputMessage.hasOwnProperty(key)) {
                message[key] = (inputMessage as any)[key];
            }
        }
        if (this.calculateExpiration) {
            const exp = this.calculateExpiration();
            if (message.exp === undefined || exp <  message.exp) {
                message.exp = exp;
            }
        }
        return message;
    }
}
