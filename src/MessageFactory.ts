export class Duration {
    constructor(
        private years: number = 0,
        private month: number = 0,
        private days: number = 0,
        private hours: number = 0,
        private minutes: number = 0) {
    }

    getExpiration() {
        const now = new Date();
        return new Date(
            now.getFullYear() + this.years,
            now.getMonth() + this.month,
            now.getDate() + this.days,
            now.getHours() + this.hours,
            now.getMinutes() + this.minutes,
        );
    }
}

export interface  IStdMessageFactoryOptions {
    issuer?: string,
    subject?: string,
    audience?: string,
    notBefore?: Date,
    issuedAt?: Date,
    tokenIdentifier?: Date,
}

export interface IMessageFactoryOptionsWithExpiration extends IStdMessageFactoryOptions {
    expiration?: Date,
}

export interface IMessageFactoryOptionsWithDuration extends IStdMessageFactoryOptions {
    duration: Duration,
}

export type IMessageFactoryOptions = IMessageFactoryOptionsWithDuration|IMessageFactoryOptionsWithExpiration;

export interface  IMessageParameters {
    iss?: IMessageFactoryOptions['issuer'],
    sub?: IMessageFactoryOptions['subject'],
    aud?: IMessageFactoryOptions['audience'],
    exp?: IMessageFactoryOptionsWithExpiration['expiration'],
    nbf?: IMessageFactoryOptions['notBefore'],
    iat?: IMessageFactoryOptions['issuedAt'],
    jti?: IMessageFactoryOptions['tokenIdentifier'],
}

const ParamtersMaping =  Object.freeze({
    issuer: 'iss',
    subject: 'sub',
    audience: 'aud',
    expiration: 'aud',
    notBefore: 'nbf',
    issuedAt: 'iat',
    tokenIdentifier: 'jti',
});

const invalidInputMessageTokens: ReadonlyArray<string> = Object.freeze(
    Object.keys(ParamtersMaping).map(k => (ParamtersMaping as any)[k] as string)
);

export class MessageFactory {
    private readonly options?: IMessageParameters
    private readonly calculateExpiration?: () => Date;

    constructor(options?: IMessageFactoryOptions) {
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
        for (const keys in inputMessage) {
            if (!invalidInputMessageTokens.includes(keys)) {
                message[keys] = (this.options as any)[keys];
            }
        }
        if (this.options) {
            for (const keys in this.options) {
                message[keys] = (this.options as any)[keys];
            }
        }
        if (this.calculateExpiration) {
            const exp = this.calculateExpiration();
            if (message.exp === undefined || exp <  message.exp) {
                message.exp = exp;
            }
        }
        return message as K&IMessageParameters;
    }

    private static toMessageOptions(options?: IMessageFactoryOptions): undefined|IMessageParameters
    {
        if (!options) return options;
        return Object.keys(options).reduce((acc: any, key: string) => {
            acc[(ParamtersMaping as any)[key]] = (options as any)[key];
            return acc as IMessageParameters;
        },
        {} as IMessageParameters);
    }
}
