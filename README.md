# High level library for Paseto

## Used libs 

Based on [paseto.js](https://www.npmjs.com/package/paseto.js) but provide a higher level of abstraction.

Thx to sloonz for his original `.d.ts` file ([his repository](https://github.com/sloonz/paseto.js)).

(If you are using typescipt and have a problem with types you can download the `.d.ts` file from his repository.)

## How to

### Use this lib as a JWT like

#### Instantiate with a symmetric key (local)

This exemple use randomly generated key.

```typescript
import * as assert from 'assert';
import { PasetoFactory, PasetoVersion } from 'PasetoHlvl';

const pasetoFactory = PasetoFactory.createInstance(PasetoVersion.v2);
const paseto = await pasetoFactory.getLocalKey();
const crypted = await paseto.encrypt('Hello world');

assert.strictEqual(
    await paseto.decrypt(crypted),
    'Hello world',
);
```

#### With a constant key.

```typescript
import * as assert from 'assert';
import { PasetoFactory, PasetoVersion } from 'PasetoHlvl';

const localKey = Buffer.from('DL/1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG+NsZvM5VCc=', 'base64');

const pasetoFactory = PasetoFactory.createInstance(PasetoVersion.v2);
const pasetoLocal = await pasetoFactory.getLocalKey(localKey);
const cryptedMessage = await pasetoLocal.encrypt('Hello world');
const message = await pasetoLocal.decrypt(cryptedMessage);

assert.strictEqual(
    message,
    'hello world'
);
```

### Write a complex message

```typescript
import * as assert from 'assert';
import {
    Duration
    MessageFactory,
    PasetoFactory,
    PasetoVersion
} from 'PasetoHlvl';

const durationOfFiveMinutes = Duration.shortDuration(5);
const durationOfTwoYearOneMounth = new Duration(2, 1);
const longLivingMessageFactory = new MessageFactory({ duration: durationOfTwoYearOneMounth });
const shortLivingMessageFactory = new MessageFactory({ duration: durationOfFiveMinutes });
const localKey = Buffer.from('DL/1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG+NsZvM5VCc=', 'base64');

const pasetoFactory = PasetoFactory.createInstance(PasetoVersion.v2);
const pasetoLocal = await pasetoFactory.getLocalKey(localKey);
const longTimeCryptedMessage = await pasetoLocal.encrypt(longLivingMessageFactory.createMessage(hello: world));
const shortTimeCryptedMessage = await pasetoLocal.encrypt(shortLivingMessageFactory.createMessage(hello: world));
let message = await pasetoLocal.decrypt(longTimeCryptedMessage);

assert.strictEqual(
    message.hello,
    'world'
);

message = await pasetoLocal.decrypt(shortTimeCryptedMessage);

assert.strictEqual(
    message.hello,
    'world'
);

```

### Message Validation

To validate et message you can use the MessageValidator class

```typescript
const message = await pasetoLocal.decrypt(token);

/*
Equivalent to :
const validatorFactory = new ValidatorFactory(options)
const messageValidator = validatorFactory.validator(message, moreSpecificOptions)
 */
const messageValidator = new MessageValidator(message);

assert.ok(!messageValidator.isExpired());
// checks dates for (Expiration, Not Before, Issued At)
assert.ok(!messageValidator.isValid({now: new Date(0)}));
assert.ok(messageValidator.isValid({
    audience: 'pie-hosted.com';
    tokenIdentifier: '87IFSGFgPNtQNNuw0AtuLttPYFfYwOkjhqdWcLoYQHvL';
    issuer: 'paragonie.com';
    subject: 'documentation'
}));
// To force the check even if an element is not present in the message (does not apply to expire)
assert.ok(!messageValidator.isValidStrict({
    audience: 'pie-hosted.com';
    tokenIdentifier: '87IFSGFgPNtQNNuw0AtuLttPYFfYwOkjhqdWcLoYQHvL';
    issuer: 'paragonie.com';
    subject: 'documentation'
}));

/*
It is also possible to call :

validatorFactory.isValidStrict(message, {
    audience: 'pie-hosted.com';
    tokenIdentifier: '87IFSGFgPNtQNNuw0AtuLttPYFfYwOkjhqdWcLoYQHvL';
    issuer: 'paragonie.com';
    subject: 'documentation'
});
*/

```
