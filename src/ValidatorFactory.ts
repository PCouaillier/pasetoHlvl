import { IValidationOptions, MessageValidator } from './MessageValidator';
import { ValidatorFactoryWrapper } from './ValidatorFactoryWrapper';

export class ValidatorFactory {
    private readonly options: IValidationOptions;

    public constructor(options?: IValidationOptions) {
        this.options = options || {};
    }

    public validator(message: object, options?: IValidationOptions): ValidatorFactoryWrapper {
        return new ValidatorFactoryWrapper(
            new MessageValidator(message),
            options
                ? Object.assign(this.options, options)
                : this.options,
        );
    }

    public isValid(message: object, options?: IValidationOptions): boolean {
        return (new ValidatorFactoryWrapper(
            new MessageValidator(message),
            this.options,
        )).isValid(options);
    }

    public isValidStrict(message: object, options?: IValidationOptions): boolean {
        return (new ValidatorFactoryWrapper(
            new MessageValidator(message),
            this.options,
        )).isValidStrict(options);
    }
}
