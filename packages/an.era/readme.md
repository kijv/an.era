# an.era

API client for Are.na.

# Install

```
npm install an.era
```

# Usage

```js
import { arenaClient, parseResponse } from './src';

const arena = arenaClient();

const channel = await parseResponse(
  arena.v3.channels[':id'].$get({ param: { id: 'arena' } }),
);
```

# Configuration

- baseUrl: `string` (default: `https://api.are.na`)
- fetch: `fetch`-like function
- init: `RequestInit`
- buildSearchParams: `(query: Record<string, string | string[]>) => URLSearchParams`
- headers: Same as `init`'s `headers` property, but can alternatively provide a function that returns the same type
