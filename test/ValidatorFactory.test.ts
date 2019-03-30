import * as assert from 'assert';
import {ValidatorFactory} from "../src/ValidatorFactory";

describe('ValidatorFactory', () => {
    describe('+isValid', () => {
        const factory = new ValidatorFactory({subject: /^test-/});
        const message = {};
        const validator = factory.validator(message);
        assert.notStrictEqual(validator, undefined);
        assert.strictEqual(validator.isValid(), factory.isValid(message));
        assert.ok(validator.isValid(message));
    });
    describe('+isValidStrict', () => {
        const factory = new ValidatorFactory({subject: /^test-/});
        const message = {sub: 'test-ValidatorFactory'};
        const validator = factory.validator(message);
        assert.notStrictEqual(validator, undefined);
        assert.strictEqual(validator.isValidStrict(), factory.isValidStrict(message));
        assert.ok(validator.isValidStrict());
    });
});
