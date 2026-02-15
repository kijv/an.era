# an.era

an.era is a API wrapper for the Are.na API

## API Instance

The API instance is, by default, grouped by their tags (e.g., `channels`, `blocks`, `users`, etc.) and, within each group, some operations are possibly grouped if they share similar path parameters (e.g., `blocks.block({ id })`). Enabling the `plain` option will return an ungrouped API instance with each operation named as specified by the OpenAPI specification.

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
