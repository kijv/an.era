# an.era

an.era is a API wrapper for the Are.na API

## API Instance

The API instance is, by default, designed to group related functions together. These functions can be accessed via the property of their "group" name, for example `arena.channels` or `arena.blocks`, with their respective methods (shorthanded operation names). You can disable this behavior by setting the `plain` option to `true`.

#### Example

```js
import { createArena } from 'an.era';

const arena = createArena({
  /* configuration options... */
});
```

## Configuration

> All configuration options are optional.

#### `accessToken` (String)

Bearer token authentication.

Accepts two token types:

- OAuth2 access tokens (obtained via OAuth2 flow with Doorkeeper)
- Personal access tokens (from your account settings at are.na/settings)

Example: `Authorization: Bearer YOUR_TOKEN`

#### `plain` (Boolean)

Returned API Instance contains ungrouped functions with the names of the OpenAPI specification names. Default: `false`

#### `ignoreValidation` (Boolean)

Ignore validation errors. Meaningful if using a different <a href="#configuration-baseurl">baseUrl</a> or testing. Default: `false`

#### `baseUrl` (String)

Base URL for the Are.na API. Defaults to `https://api.are.na/v3`.

#### `requestInit` (RequestInit)

Pass additional request options to the underlying fetch API. Default: `{}`

#### `operations` ⚠️

This is intended to allow passing a different set of operations to the API instance, while still being typed. This property is subject to change and should not be relied upon.

## API Reference

View the (latest) API reference [here](https://github.com/kijv/an.era#api-reference).
