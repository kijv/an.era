import * as r from './components/responses';
import * as s from './components/schemas';
import * as p from './components/parameters';
import * as v from 'valibot';

const Authentication = {
  createOAuthToken: {
    method: 'post',
    path: '/v3/oauth/token',
    parameters: {},
    body: {
      required: true,
      content: {
        'application/x-www-form-urlencoded': v.required(
          v.partial(
            v.object({
              grant_type: v.pipe(
                v.picklist(['authorization_code', 'client_credentials']),
                v.metadata({
                  description: 'The OAuth 2.0 grant type',
                }),
              ),
              client_id: v.pipe(
                v.string(),
                v.metadata({
                  description:
                    "Your application's client ID (required for all grant types)",
                }),
              ),
              client_secret: v.pipe(
                v.string(),
                v.metadata({
                  description:
                    "Your application's client secret (required for confidential clients, omit for PKCE)",
                }),
              ),
              code: v.pipe(
                v.string(),
                v.metadata({
                  description:
                    'Authorization code (required for authorization_code grant)',
                }),
              ),
              redirect_uri: v.pipe(
                v.string(),
                v.metadata({
                  description:
                    'Redirect URI used in authorization request (required for authorization_code grant)',
                }),
              ),
              code_verifier: v.pipe(
                v.string(),
                v.metadata({
                  description:
                    'PKCE code verifier (required when authorization used code_challenge).\nMust be 43-128 characters from [A-Z], [a-z], [0-9], "-", ".", "_", "~".\n',
                }),
              ),
            }),
          ),
          ['grant_type'],
        ),
      },
    },
    responses: {
      '200': {
        'application/json': v.pipe(
          v.required(
            v.object({
              access_token: v.pipe(
                v.string(),
                v.metadata({
                  description: 'The access token to use for API requests',
                }),
              ),
              token_type: v.pipe(
                v.picklist(['Bearer']),
                v.metadata({
                  description: 'Token type (always "Bearer")',
                }),
              ),
              scope: v.pipe(
                v.string(),
                v.metadata({
                  description: 'Granted scopes (space-separated)',
                }),
                v.examples(['write']),
              ),
              created_at: v.pipe(
                v.pipe(v.number(), v.integer()),
                v.metadata({
                  description: 'Unix timestamp when the token was created',
                }),
              ),
            }),
            ['access_token', 'token_type', 'scope', 'created_at'],
          ),
          v.metadata({
            description: 'Access token granted',
          }),
        ),
      },
      '400': {
        'application/json': v.pipe(
          v.object({
            error: v.picklist([
              'invalid_request',
              'invalid_client',
              'invalid_grant',
              'unauthorized_client',
              'unsupported_grant_type',
            ]),
            error_description: v.string(),
          }),
          v.metadata({
            description: 'Invalid request',
          }),
        ),
      },
      '401': {
        'application/json': v.pipe(
          v.object({
            error: v.pipe(v.string(), v.examples(['invalid_client'])),
            error_description: v.pipe(
              v.string(),
              v.examples([
                'Client authentication failed due to unknown client or invalid credentials.',
              ]),
            ),
          }),
          v.metadata({
            description: 'Invalid client credentials',
          }),
        ),
      },
    },
  },
};
const System = {
  getOpenapiSpec: {
    method: 'get',
    path: '/v3/openapi',
    parameters: {},
    responses: {
      '200': {
        'application/yaml': v.pipe(
          v.string(),
          v.metadata({
            description: 'OpenAPI specification in YAML format',
          }),
        ),
      },
      '404': r.NotFoundResponse,
    },
  },
  getOpenapiSpecJson: {
    method: 'get',
    path: '/v3/openapi.json',
    parameters: {},
    responses: {
      '200': {
        'application/json': v.pipe(
          v.record(v.string(), v.union([])),
          v.metadata({
            description: 'OpenAPI specification in JSON format',
          }),
        ),
      },
      '404': r.NotFoundResponse,
    },
  },
  getPing: {
    method: 'get',
    path: '/v3/ping',
    parameters: {},
    responses: {
      '200': {
        'application/json': s.PingResponseSchema,
      },
      '429': r.RateLimitResponse,
    },
  },
};
const Blocks = {
  id: {
    $parameters: {
      id: p.IdParamSchema,
    },
    getBlock: {
      method: 'get',
      path: '/v3/blocks/{id}',
      parameters: {
        path: {
          id: p.IdParamSchema,
        },
      },
      responses: {
        '200': {
          'application/json': s.BlockSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getBlockConnections: {
      method: 'get',
      path: '/v3/blocks/{id}/connections',
      parameters: {
        path: {
          id: p.IdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
          filter: v.nullish(
            v.pipe(
              v.picklist(['ALL', 'OWN', 'EXCLUDE_OWN']),
              v.metadata({
                description:
                  'Filter connections by ownership:\n- `ALL`: All accessible connections (default)\n- `OWN`: Only connections created by the current user\n- `EXCLUDE_OWN`: All connections except those created by the current user\n',
              }),
              v.examples(['ALL']),
            ),
          ),
        },
      },
      responses: {
        '200': {
          'application/json': s.ChannelListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getBlockComments: {
      method: 'get',
      path: '/v3/blocks/{id}/comments',
      parameters: {
        path: {
          id: p.IdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.CommentListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
  },
};
const Channels = {
  id: {
    $parameters: {
      id: p.SlugOrIdParamSchema,
    },
    getChannel: {
      method: 'get',
      path: '/v3/channels/{id}',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
      },
      responses: {
        '200': {
          'application/json': s.ChannelSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getChannelContents: {
      method: 'get',
      path: '/v3/channels/{id}/contents',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ChannelContentSortParamSchema),
          user_id: v.nullish(
            v.pipe(
              v.pipe(v.number(), v.integer()),
              v.metadata({
                description: 'Filter by user who added the content',
              }),
              v.examples([12345]),
            ),
          ),
        },
      },
      responses: {
        '200': {
          'application/json': s.ConnectableListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getChannelConnections: {
      method: 'get',
      path: '/v3/channels/{id}/connections',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.ChannelListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getChannelFollowers: {
      method: 'get',
      path: '/v3/channels/{id}/followers',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.UserListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
  },
};
const Users = {
  getCurrentUser: {
    method: 'get',
    path: '/v3/me',
    parameters: {},
    responses: {
      '200': {
        'application/json': s.UserSchema,
      },
      '401': r.UnauthorizedResponse,
      '429': r.RateLimitResponse,
    },
  },
  id: {
    $parameters: {
      id: p.SlugOrIdParamSchema,
    },
    getUser: {
      method: 'get',
      path: '/v3/users/{id}',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
      },
      responses: {
        '200': {
          'application/json': s.UserSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getUserContents: {
      method: 'get',
      path: '/v3/users/{id}/contents',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ContentSortParamSchema),
          type: v.nullish(p.ContentTypeFilterParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.ConnectableListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getUserFollowers: {
      method: 'get',
      path: '/v3/users/{id}/followers',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.UserListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getUserFollowing: {
      method: 'get',
      path: '/v3/users/{id}/following',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
          type: v.nullish(
            v.pipe(
              v.picklist(['User', 'Channel', 'Group']),
              v.metadata({
                description: 'Filter by followable type',
              }),
              v.examples(['Channel']),
            ),
          ),
        },
      },
      responses: {
        '200': {
          'application/json': s.FollowableListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
  },
};
const Groups = {
  id: {
    $parameters: {
      id: p.SlugOrIdParamSchema,
    },
    getGroup: {
      method: 'get',
      path: '/v3/groups/{id}',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
      },
      responses: {
        '200': {
          'application/json': s.GroupSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getGroupContents: {
      method: 'get',
      path: '/v3/groups/{id}/contents',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ContentSortParamSchema),
          type: v.nullish(p.ContentTypeFilterParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.ConnectableListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
    getGroupFollowers: {
      method: 'get',
      path: '/v3/groups/{id}/followers',
      parameters: {
        path: {
          id: p.SlugOrIdParamSchema,
        },
        query: {
          page: v.nullish(p.PageParamSchema),
          per: v.nullish(p.PerParamSchema),
          sort: v.nullish(p.ConnectionSortParamSchema),
        },
      },
      responses: {
        '200': {
          'application/json': s.UserListResponseSchema,
        },
        '401': r.UnauthorizedResponse,
        '403': r.ForbiddenResponse,
        '404': r.NotFoundResponse,
        '429': r.RateLimitResponse,
      },
    },
  },
};
const Search = {
  search: {
    method: 'get',
    path: '/v3/search',
    parameters: {
      query: {
        q: v.nullish(
          v.pipe(
            v.string(),
            v.metadata({
              description:
                'Search query. Use `*` to match everything (useful with filters).\n',
            }),
            v.examples(['design']),
          ),
        ),
        type: v.nullish(
          v.pipe(
            v.array(s.SearchTypeFilterSchema),
            v.metadata({
              description:
                'Content types to search (comma-separated).\nBlock subtypes: Text, Image, Link, Attachment, Embed.\nOther: Channel, User, Group, Block (all block types).\n',
            }),
            v.examples([['Image', 'Link']]),
          ),
        ),
        scope: v.nullish(
          v.pipe(
            v.string(),
            v.metadata({
              description:
                "Where to search:\n- `all` - Everything (default)\n- `my` - Current user's content\n- `following` - Content from followed users/channels\n- `user:ID` - Specific user's content\n- `group:ID` - Specific group's content\n- `channel:ID` - Specific channel's content\n",
            }),
            v.examples(['channel:12345']),
          ),
        ),
        in: v.nullish(
          v.pipe(
            v.array(
              v.picklist(['name', 'description', 'content', 'domain', 'url']),
            ),
            v.metadata({
              description:
                'Fields to search within (comma-separated).\nOptions: name, description, content, domain, url.\nDefaults to all fields.\n',
            }),
            v.examples([['name', 'description']]),
          ),
        ),
        ext: v.nullish(
          v.pipe(
            v.array(s.FileExtensionSchema),
            v.metadata({
              description: 'Filter by file extensions (comma-separated)',
            }),
            v.examples([['pdf', 'jpg']]),
          ),
        ),
        sort: v.nullish(
          v.pipe(
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
            v.metadata({
              description:
                'Sort order. Options:\n- `score_desc` (default) - Relevance\n- `created_at_desc`, `created_at_asc`\n- `updated_at_desc`, `updated_at_asc`\n- `name_asc`, `name_desc`\n- `connections_count_desc`\n- `random` (use with `seed` for reproducibility)\n',
            }),
            v.examples(['created_at_desc']),
          ),
        ),
        after: v.nullish(
          v.pipe(
            v.string(),
            v.metadata({
              description:
                'Only return results updated after this date (ISO 8601)',
            }),
            v.examples(['2024-01-01T00:00:00Z']),
          ),
        ),
        seed: v.nullish(
          v.pipe(
            v.pipe(v.number(), v.integer()),
            v.metadata({
              description:
                'Random seed for reproducible results (use with `sort=random`)',
            }),
            v.examples([1234567890]),
          ),
        ),
        page: v.nullish(p.PageParamSchema),
        per: v.nullish(p.PerParamSchema),
      },
    },
    responses: {
      '200': {
        'application/json': s.EverythingListResponseSchema,
      },
      '400': r.ValidationErrorResponse,
      '401': r.UnauthorizedResponse,
      '403': {
        'application/json': s.ErrorSchema,
      },
      '429': r.RateLimitResponse,
    },
  },
};

export { Authentication, System, Blocks, Channels, Users, Groups, Search };
