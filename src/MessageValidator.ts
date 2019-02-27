import { IMessageParameters } from "./MessageFactory";

export interface IValidationOptions {
    audience?: string;
    tokenIdentifier?: string;
    issuer?: string;
    subject?: string;
    now?: Date;
}

export interface IMessageValidator {

    isForAudience(audience: string): boolean;

    isIdentifiedBy(tokenIdentifier: string): boolean;

    isIssuedBy(issuer: string): boolean;

    isSubject(subject: string): boolean;

    isExpired(date?: Date): boolean;

    isIssuedAtValid(date?: Date): boolean;

    isNotBeforeValid(date?: Date): boolean;

    isValid(options?: IValidationOptions): boolean;

    isValidStrict(options?: IValidationOptions): boolean;
}

export class MessageValidator implements IMessageValidator {
    private readonly message: IMessageParameters;

    public constructor(message: object) {
        if (!message) {
            throw new Error('message is not valid');
        }
        if (message instanceof String) {
            throw new Error('message is a string instead of object');
        }
        if (message instanceof Number) {
            throw new Error('message is a number instead of object');
        }
        if (message instanceof Array) {
            throw new Error('message is an Array instead of object');
        }
        this.message = message;
    }

    public isForAudience(audience: string): boolean {
        return this.message.aud === audience;
    }

    public isIdentifiedBy(tokenIdentifier: string): boolean {
        return this.message.jti === tokenIdentifier;
    }

    public isIssuedBy(issuer: string): boolean {
        return this.message.iss === issuer;
    }

    public isSubject(subject: string): boolean {
        return this.message.sub === subject;
    }

    public isExpired(date?: Date): boolean {
        const message = this.message;
        if (!message.exp) {
            return false;
        }
        return (message.exp instanceof Date ? message.exp : new Date(message.exp)) < (date ? date : new Date());
    }

    public isIssuedAtValid(date?: Date): boolean {
        const message = this.message;
        if (!message.iat) {
            return false;
        }
        return (message.iat instanceof Date ? message.iat : new Date(message.iat)) <= (date ? date : new Date());
    }

    public isNotBeforeValid(date?: Date): boolean {
        const message = this.message;
        if (!message.nbf) {
            return false;
        }
        return (message.nbf instanceof Date ? message.nbf : new Date(message.nbf)) <= (date ? date : new Date());
    }

    /**
     * @param options
     */
    public isValid(options?: IValidationOptions): boolean {
        if (options === undefined) {
            options = {};
        }
        const message = this.message;
        return !this.isExpired(options.now) &&
            (message.iat === undefined || this.isIssuedAtValid(options.now)) &&
            (message.nbf === undefined || this.isNotBeforeValid(options.now)) &&
            (options.audience === undefined || message.aud === undefined || this.isForAudience(options.audience)) &&
            (options.tokenIdentifier === undefined || message.jti === undefined
                || this.isIdentifiedBy(options.tokenIdentifier)) &&
            (options.issuer === undefined || message.iss === undefined || this.isIssuedBy(options.issuer)) &&
            (options.subject === undefined || message.sub === undefined || this.isSubject(options.subject))
        ;
    }

    /**
     * @param options
     */
    public isValidStrict(options?: IValidationOptions): boolean {
        if (options === undefined) {
            options = {};
        }
        return !this.isExpired(options.now) &&
                (this.isIssuedAtValid(options.now)) &&
                (this.isNotBeforeValid(options.now)) &&
                (options.audience === undefined || this.isForAudience(options.audience)) &&
                (options.tokenIdentifier === undefined || this.isIdentifiedBy(options.tokenIdentifier)) &&
                (options.issuer === undefined || this.isIssuedBy(options.issuer)) &&
                (options.subject === undefined || this.isSubject(options.subject))
        ;
    }
}
