import * as v from 'valibot';
import * as s from './components/schemas';
export const createOAuthToken = {
  path: '/v3/oauth/token',
  method: 'post',
  tags: ['Authentication'],
  parameters: {
    formData: v.object({
      grant_type: v.picklist(['authorization_code', 'client_credentials']),
      client_id: v.optional(v.string()),
      client_secret: v.optional(v.string()),
      code: v.optional(v.string()),
      redirect_uri: v.optional(v.pipe(v.string(), v.url())),
      code_verifier: v.optional(v.string()),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign(
        {},
        v.object({
          access_token: v.string(),
          token_type: v.literal('Bearer'),
          scope: v.string(),
          created_at: v.pipe(v.number(), v.integer()),
        }),
        {
          _type: {} as unknown as {
            access_token: string;
            token_type: 'Bearer';
            scope: string;
            created_at: number;
          },
        },
      ),
    },
    '400': {
      'application/json': Object.assign(
        {},
        v.object({
          error: v.optional(
            v.picklist([
              'invalid_request',
              'invalid_client',
              'invalid_grant',
              'unauthorized_client',
              'unsupported_grant_type',
            ]),
          ),
          error_description: v.optional(v.string()),
        }),
        {
          _type: {} as unknown as {
            error?:
              | 'invalid_request'
              | 'invalid_client'
              | 'invalid_grant'
              | 'unauthorized_client'
              | 'unsupported_grant_type';
            error_description?: string;
          },
        },
      ),
    },
    '401': {
      'application/json': Object.assign(
        {},
        v.object({
          error: v.optional(v.string()),
          error_description: v.optional(v.string()),
        }),
        {
          _type: {} as unknown as {
            error?: string;
            error_description?: string;
          },
        },
      ),
    },
  },
} as const;
export const getOpenapiSpec = {
  path: '/v3/openapi',
  method: 'get',
  tags: ['System'],
  parameters: {},
  response: {
    '200': {
      'application/yaml': Object.assign({}, v.string(), {
        _type: {} as unknown as string,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
  },
} as const;
export const getOpenapiSpecJson = {
  path: '/v3/openapi.json',
  method: 'get',
  tags: ['System'],
  parameters: {},
  response: {
    '200': {
      'application/json': Object.assign({}, v.object({}), {
        _type: {} as unknown as {},
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
  },
} as const;
export const getPing = {
  path: '/v3/ping',
  method: 'get',
  tags: ['System'],
  parameters: {},
  response: {
    '200': {
      'application/json': Object.assign({}, s.PingResponseSchema, {
        _type: {} as unknown as s.PingResponse,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const createBlock = {
  path: '/v3/blocks',
  method: 'post',
  tags: ['Blocks'],
  parameters: {
    body: v.object({
      value: v.string(),
      channel_ids: v.pipe(
        v.array(v.pipe(v.number(), v.integer())),
        v.minLength(1),
        v.maxLength(6),
      ),
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      original_source_url: v.optional(v.pipe(v.string(), v.url())),
      original_source_title: v.optional(v.string()),
      alt_text: v.optional(v.string()),
      insert_at: v.optional(v.pipe(v.number(), v.integer())),
    }),
  },
  response: {
    '201': {
      'application/json': Object.assign({}, s.BlockSchema, {
        _type: {} as unknown as s.Block,
      }),
    },
    '400': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getBlock = {
  path: '/v3/blocks/{id}',
  method: 'get',
  tags: ['Blocks'],
  parameters: {
    path: v.object({ id: v.pipe(v.number(), v.integer()) }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.BlockSchema, {
        _type: {} as unknown as s.Block,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const updateBlock = {
  path: '/v3/blocks/{id}',
  method: 'put',
  tags: ['Blocks'],
  parameters: {
    path: v.object({ id: v.pipe(v.number(), v.integer()) }),
    body: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      content: v.optional(v.string()),
      alt_text: v.optional(v.string()),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.BlockSchema, {
        _type: {} as unknown as s.Block,
      }),
    },
    '400': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '422': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getBlockConnections = {
  path: '/v3/blocks/{id}/connections',
  method: 'get',
  tags: ['Blocks'],
  parameters: {
    path: v.object({ id: v.pipe(v.number(), v.integer()) }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
      filter: v.optional(v.picklist(['ALL', 'OWN', 'EXCLUDE_OWN'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ChannelListResponseSchema, {
        _type: {} as unknown as s.ChannelListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getBlockComments = {
  path: '/v3/blocks/{id}/comments',
  method: 'get',
  tags: ['Blocks'],
  parameters: {
    path: v.object({ id: v.pipe(v.number(), v.integer()) }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.CommentListResponseSchema, {
        _type: {} as unknown as s.CommentListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const createChannel = {
  path: '/v3/channels',
  method: 'post',
  tags: ['Channels'],
  parameters: {
    body: v.object({
      title: v.string(),
      visibility: v.optional(v.picklist(['public', 'private', 'closed'])),
      description: v.optional(v.string()),
      group_id: v.optional(v.pipe(v.number(), v.integer())),
    }),
  },
  response: {
    '201': {
      'application/json': Object.assign({}, s.ChannelSchema, {
        _type: {} as unknown as s.Channel,
      }),
    },
    '400': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '422': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getChannel = {
  path: '/v3/channels/{id}',
  method: 'get',
  tags: ['Channels'],
  parameters: {
    path: v.object({ id: v.string() }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ChannelSchema, {
        _type: {} as unknown as s.Channel,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const updateChannel = {
  path: '/v3/channels/{id}',
  method: 'put',
  tags: ['Channels'],
  parameters: {
    path: v.object({ id: v.string() }),
    body: v.object({
      title: v.optional(v.string()),
      visibility: v.optional(v.picklist(['public', 'private', 'closed'])),
      description: v.optional(v.union([v.string(), v.null_()])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ChannelSchema, {
        _type: {} as unknown as s.Channel,
      }),
    },
    '400': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '422': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const deleteChannel = {
  path: '/v3/channels/{id}',
  method: 'delete',
  tags: ['Channels'],
  parameters: {
    path: v.object({ id: v.string() }),
  },
  response: {
    '204': {},
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getConnection = {
  path: '/v3/connections/{id}',
  method: 'get',
  tags: ['Connections'],
  parameters: {
    path: v.object({ id: v.pipe(v.number(), v.integer()) }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ConnectionSchema, {
        _type: {} as unknown as s.Connection,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const deleteConnection = {
  path: '/v3/connections/{id}',
  method: 'delete',
  tags: ['Connections'],
  parameters: {
    path: v.object({ id: v.pipe(v.number(), v.integer()) }),
  },
  response: {
    '204': {},
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getChannelContents = {
  path: '/v3/channels/{id}/contents',
  method: 'get',
  tags: ['Channels'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(
        v.picklist([
          'position_asc',
          'position_desc',
          'created_at_asc',
          'created_at_desc',
          'updated_at_asc',
          'updated_at_desc',
        ]),
      ),
      user_id: v.optional(v.pipe(v.number(), v.integer())),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ConnectableListResponseSchema, {
        _type: {} as unknown as s.ConnectableListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getChannelConnections = {
  path: '/v3/channels/{id}/connections',
  method: 'get',
  tags: ['Channels'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ChannelListResponseSchema, {
        _type: {} as unknown as s.ChannelListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getChannelFollowers = {
  path: '/v3/channels/{id}/followers',
  method: 'get',
  tags: ['Channels'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.UserListResponseSchema, {
        _type: {} as unknown as s.UserListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getCurrentUser = {
  path: '/v3/me',
  method: 'get',
  tags: ['Users'],
  parameters: {},
  response: {
    '200': {
      'application/json': Object.assign({}, s.UserSchema, {
        _type: {} as unknown as s.User,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getUser = {
  path: '/v3/users/{id}',
  method: 'get',
  tags: ['Users'],
  parameters: {
    path: v.object({ id: v.string() }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.UserSchema, {
        _type: {} as unknown as s.User,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getUserContents = {
  path: '/v3/users/{id}/contents',
  method: 'get',
  tags: ['Users'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(
        v.picklist([
          'created_at_asc',
          'created_at_desc',
          'updated_at_asc',
          'updated_at_desc',
        ]),
      ),
      type: v.optional(
        v.picklist([
          'Text',
          'Image',
          'Link',
          'Attachment',
          'Embed',
          'Channel',
          'Block',
        ]),
      ),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ConnectableListResponseSchema, {
        _type: {} as unknown as s.ConnectableListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getUserFollowers = {
  path: '/v3/users/{id}/followers',
  method: 'get',
  tags: ['Users'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.UserListResponseSchema, {
        _type: {} as unknown as s.UserListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getUserFollowing = {
  path: '/v3/users/{id}/following',
  method: 'get',
  tags: ['Users'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
      type: v.optional(v.picklist(['User', 'Channel', 'Group'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.FollowableListResponseSchema, {
        _type: {} as unknown as s.FollowableListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getGroup = {
  path: '/v3/groups/{id}',
  method: 'get',
  tags: ['Groups'],
  parameters: {
    path: v.object({ id: v.string() }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.GroupSchema, {
        _type: {} as unknown as s.Group,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getGroupContents = {
  path: '/v3/groups/{id}/contents',
  method: 'get',
  tags: ['Groups'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(
        v.picklist([
          'created_at_asc',
          'created_at_desc',
          'updated_at_asc',
          'updated_at_desc',
        ]),
      ),
      type: v.optional(
        v.picklist([
          'Text',
          'Image',
          'Link',
          'Attachment',
          'Embed',
          'Channel',
          'Block',
        ]),
      ),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.ConnectableListResponseSchema, {
        _type: {} as unknown as s.ConnectableListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const getGroupFollowers = {
  path: '/v3/groups/{id}/followers',
  method: 'get',
  tags: ['Groups'],
  parameters: {
    path: v.object({ id: v.string() }),
    query: v.object({
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
      sort: v.optional(v.picklist(['created_at_desc', 'created_at_asc'])),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.UserListResponseSchema, {
        _type: {} as unknown as s.UserListResponse,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '404': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export const search = {
  path: '/v3/search',
  method: 'get',
  tags: ['Search'],
  parameters: {
    query: v.object({
      q: v.optional(v.string()),
      type: v.optional(v.array(s.SearchTypeFilterSchema)),
      scope: v.optional(v.string()),
      in: v.optional(
        v.array(
          v.picklist(['name', 'description', 'content', 'domain', 'url']),
        ),
      ),
      ext: v.optional(v.array(s.FileExtensionSchema)),
      sort: v.optional(
        v.picklist([
          'score_desc',
          'created_at_desc',
          'created_at_asc',
          'updated_at_desc',
          'updated_at_asc',
          'name_asc',
          'name_desc',
          'connections_count_desc',
          'random',
        ]),
      ),
      after: v.optional(v.pipe(v.string(), v.isoDateTime())),
      seed: v.optional(v.pipe(v.number(), v.integer())),
      page: v.optional(v.pipe(v.number(), v.minValue(1))),
      per: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
    }),
  },
  response: {
    '200': {
      'application/json': Object.assign({}, s.EverythingListResponseSchema, {
        _type: {} as unknown as s.EverythingListResponse,
      }),
    },
    '400': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '401': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '403': {
      'application/json': Object.assign({}, s.ErrorSchema, {
        _type: {} as unknown as s.Error,
      }),
    },
    '429': {
      'application/json': Object.assign({}, s.RateLimitErrorSchema, {
        _type: {} as unknown as s.RateLimitError,
      }),
    },
  },
} as const;
export default {
  createOAuthToken,
  getOpenapiSpec,
  getOpenapiSpecJson,
  getPing,
  createBlock,
  getBlock,
  updateBlock,
  getBlockConnections,
  getBlockComments,
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  getConnection,
  deleteConnection,
  getChannelContents,
  getChannelConnections,
  getChannelFollowers,
  getCurrentUser,
  getUser,
  getUserContents,
  getUserFollowers,
  getUserFollowing,
  getGroup,
  getGroupContents,
  getGroupFollowers,
  search,
} as const;
