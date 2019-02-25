import {
    IMessageValidator,
    IValidationOptions,
    MessageValidator,
} from './MessageValidator';

export class ValidatorFactoryWrapper implements IMessageValidator {
    private readonly validator: MessageValidator;
    private readonly options: IValidationOptions;

    public constructor(validator: MessageValidator, options?: IValidationOptions) {
        this.validator = validator;
        this.options = options ? options : {};
    }

    public isForAudience(audience: string): boolean {
        return this.validator.isForAudience(audience);
    }

    public isIdentifiedBy(tokenIdentifier: string): boolean {
        return this.validator.isIdentifiedBy(tokenIdentifier);
    }

    public isIssuedBy(issuer: string): boolean {
        return this.validator.isIssuedBy(issuer);
    }

    public isSubject(subject: string): boolean {
        return this.validator.isSubject(subject);
    }

    public isExpired(date?: Date): boolean {
        return this.validator.isExpired(date);
    }

    public isIssuedAtValid(date?: Date): boolean {
        return this.validator.isIssuedAtValid(date);
    }

    public isNotBeforeValid(date?: Date): boolean {
        return this.validator.isNotBeforeValid(date);
    }

    public isValid(options?: IValidationOptions): boolean {
        return this.validator.isValid(options
                ? Object.assign(this.options, options)
                : this.options);
    }

    public isValidStrict(options?: IValidationOptions): boolean {
        return this.validator.isValidStrict(options
                ? Object.assign(this.options, options)
                : this.options);
    }
}
