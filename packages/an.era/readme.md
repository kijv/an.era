# an.era

API client for Are.na.

# Install

```
npm install an.era
```

# Usage

```js
import { Arena } from 'an.era';
import { parseResponse } from 'an.era/client';

const arena = new Arena();

const channel = await parseResponse(arena.channel.id('arena').$get());
```
