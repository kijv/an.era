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
              grant_type: v.picklist([
                'authorization_code',
                'client_credentials',
              ]),
              client_id: v.string(),
              client_secret: v.string(),
              code: v.string(),
              redirect_uri: v.string(),
              code_verifier: v.string(),
            }),
          ),
          ['grant_type'],
        ),
      },
    },
    responses: {
      '200': {
        'application/json': v.required(
          v.partial(
            v.object({
              access_token: v.string(),
              token_type: v.picklist(['Bearer']),
              scope: v.string(),
              created_at: v.pipe(v.number(), v.integer()),
            }),
          ),
          ['access_token', 'token_type', 'scope', 'created_at'],
        ),
      },
      '400': {
        'application/json': v.object({
          error: v.picklist([
            'invalid_request',
            'invalid_client',
            'invalid_grant',
            'unauthorized_client',
            'unsupported_grant_type',
          ]),
          error_description: v.string(),
        }),
      },
      '401': {
        'application/json': v.object({
          error: v.string(),
          error_description: v.string(),
        }),
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
        'application/yaml': v.string(),
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
        'application/json': v.record(v.string(), v.union([])),
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
          filter: v.nullish(v.picklist(['ALL', 'OWN', 'EXCLUDE_OWN'])),
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
          user_id: v.nullish(v.pipe(v.number(), v.integer())),
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
          type: v.nullish(v.picklist(['User', 'Channel', 'Group'])),
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
        q: v.nullish(v.string()),
        type: v.nullish(v.array(s.SearchTypeFilterSchema)),
        scope: v.nullish(v.string()),
        in: v.nullish(
          v.array(
            v.picklist(['name', 'description', 'content', 'domain', 'url']),
          ),
        ),
        ext: v.nullish(v.array(s.FileExtensionSchema)),
        sort: v.nullish(
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
        after: v.nullish(v.string()),
        seed: v.nullish(v.pipe(v.number(), v.integer())),
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
