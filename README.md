# High level library for Paseto

## Used libs 

Based on [paseto.js](https://www.npmjs.com/package/paseto.js) (which you probably should use instead of this one).

Thx to sloonz for his original `.d.ts` file ([his repository](https://github.com/sloonz/paseto.js)).

## How to

### How to JWT like

#### Instantiate with a symmetric key (local)

This exemple use randomly generated key.
```
import Paseto, {Usage} from '../src/paseto_usage';

const paseto = await Paseto.createInstance({usage: Usage.local}); // Usage.local === 'local'
const cryptedMessage = await paseto.encrypt('Hello world');
const message = await paseto.decrypt(cryptedMessage);

paseto.localKey() 
assert.strictEqual(message, 'hello world');
```

#### With a constant key.

```
const localKey = Buffer.from('DL/1XkMvU6Qw8OXgA430Fm4BdkCmyjnlG+NsZvM5VCc=', 'base64');
const paseto = await Paseto.createInstance({usage: Usage.local, localKey});
const cryptedMessage = await paseto.encrypt('Hello world');
const message = await paseto.decrypt(cryptedMessage);

assert.ok(message === 'hello world');
```
