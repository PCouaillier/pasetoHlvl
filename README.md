# High level library for Paseto

## Used libs 

Based on [paseto.js](https://www.npmjs.com/package/paseto.js) (which you probably should use instead of this one).

Thx to sloonz for his original `.d.ts` file ([his repository](https://github.com/sloonz/paseto.js)).

## How to

### How to JWT like

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
