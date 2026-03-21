# an.era

API client for Are.na.

# Install

```
npm install an.era
```

> The minor part of the version represents the current version of the Are.na API. It is recommendend to pin the version as breaking changes can occur with new patches.

# Usage

```js
import { Arena } from 'an.era';
import { parseResponse } from 'an.era/client';

const arena = new Arena();

// https://api.are.na/v3/channels/arena
// Can alternatively be written as `arena.$getChannel({ param: { id: 'arena' } })`
const res = arena.channel.id('arena').$get();
// parseResponse ensures there is not an error, and throws otherwise
const channel = await parseResponse(res);
```

### Client

Redestributes [`hono/client`](https://hono.dev/docs/guides/rpc#client)'s `hc` with necessary types:

```js
import { ac } from 'an.era/client';

// Base URL is required
const arena = ac('https://api.are.na');

const res = arena.v3.channels[':id'].$get({ param: { id: 'arena' } });
```

### Validator

The provided validator uses valibot, but any validation library using the [Standard Schema](https://standardschema.dev/) will work.

```js
import { Arena } from 'an.era';
import { parseResponse } from 'an.era/client';
import { validator } from 'an.era/validator';

const arena = new Arena();

const res = arena.channel.id('arena').$get();
const result = await parseResponse(res, validator.channel);

if (result.success) {
  const channel = result.data;
} else {
  const { issues } = result;
}
```
