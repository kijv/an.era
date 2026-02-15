import * as m from './mock-responses';
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  isGroupedOperation,
  transformOperations,
} from '@/api/operations/group';
import { createArena } from '@/index';
import { operations } from '@/openapi/operations';

const operationIds = Object.keys(operations) as (keyof typeof operations)[];

/** Minimal args per operation (positional: path, query, body, formData). */
const minimalArgs: Record<string, unknown[]> = {
  createOAuthToken: [{ grant_type: 'client_credentials' }],
  getOpenapiSpec: [],
  getOpenapiSpecJson: [],
  getPing: [],
  presignUpload: [
    { files: [{ filename: 'test.txt', content_type: 'text/plain' }] },
  ],
  createBlock: [{ value: 'test' }],
  batchCreateBlocks: [{ channel_ids: ['1'], blocks: [{ value: 'test' }] }],
  getBatchStatus: [{ batch_id: '550e8400-e29b-41d4-a716-446655440000' }],
  getBlock: [{ id: 1 }],
  updateBlock: [{ id: 1 }, {}],
  getBlockConnections: [{ id: 1 }],
  getBlockComments: [{ id: 1 }],
  createBlockComment: [{ id: 1 }, { body: 'test' }],
  deleteComment: [{ id: 1 }],
  createChannel: [{ title: 'test' }],
  getChannel: [{ id: 'test-channel' }],
  updateChannel: [{ id: 'test-channel' }, {}],
  deleteChannel: [{ id: 'test-channel' }],
  createConnection: [
    { connectable_id: 1, connectable_type: 'Block', channel_ids: ['1'] },
  ],
  getConnection: [{ id: 1 }],
  deleteConnection: [{ id: 1 }],
  moveConnection: [{ id: 1 }, {}],
  getChannelContents: [{ id: 'test-channel' }],
  getChannelConnections: [{ id: 'test-channel' }],
  getChannelFollowers: [{ id: 'test-channel' }],
  getCurrentUser: [],
  getUser: [{ id: 'test-user' }],
  getUserContents: [{ id: 'test-user' }],
  getUserFollowers: [{ id: 'test-user' }],
  getUserFollowing: [{ id: 'test-user' }],
  getGroup: [{ id: 'test-group' }],
  getGroupContents: [{ id: 'test-group' }],
  getGroupFollowers: [{ id: 'test-group' }],
  search: [],
};

/** Runtime args: real public IDs for actual API calls. */
const runtimeArgs: Record<string, unknown[]> = {
  ...minimalArgs,
  getChannel: [{ id: 'are-na' }],
  updateChannel: [{ id: 'are-na' }, {}],
  deleteChannel: [{ id: 'are-na' }],
  getChannelContents: [{ id: 'are-na' }],
  getChannelConnections: [{ id: 'are-na' }],
  getChannelFollowers: [{ id: 'are-na' }],
  getUser: [{ id: 'ds' }],
  getUserContents: [{ id: 'ds' }],
  getUserFollowers: [{ id: 'ds' }],
  getUserFollowing: [{ id: 'ds' }],
  getGroup: [{ id: 'are-na' }],
  getGroupContents: [{ id: 'are-na' }],
  getGroupFollowers: [{ id: 'are-na' }],
};

describe('Default', async () => {
  const api = createArena({ ignoreValidation: true });
  const transformedOperations = transformOperations(operations);

  for (const tag in transformedOperations) {
    describe(tag, () => {
      const tagValue =
        transformedOperations[tag as keyof typeof transformedOperations];

      it('is properly defined', () => {
        const obj = api[tag as keyof typeof api];
        assert.isObject(obj);
        assert.hasAllKeys(obj, Object.keys(tagValue));
      });

      for (const key in tagValue) {
        const value = tagValue[key as keyof typeof tagValue];

        const tagObj = api[tag as keyof typeof api];
        const parent = isGroupedOperation(value) ? tagObj[key]() : tagObj;

        for (const operationName of isGroupedOperation(value)
          ? Object.keys(value.operations)
          : [key]) {
          it(operationName, () => {
            assert.isFunction(parent[operationName]);
          });
        }
      }
    });
  }
});

it('Plain option works', () => {
  const api = createArena({ plain: true });
  for (const id of operationIds) {
    expect(api).toHaveProperty(id);
    expect(typeof api[id]).toBe('function');
  }
});

describe('Runtime', () => {
  const api = createArena({ plain: true, ignoreValidation: true });

  for (const id of operationIds) {
    it(`${id} runs and returns validated result`, async () => {
      const fn = api[id as keyof typeof api] as (
        ...args: unknown[]
      ) => Promise<unknown>;
      const args = runtimeArgs[id] ?? minimalArgs[id] ?? [];
      const result = await fn(...args);
      expect(result).toBeDefined();
    }, 15_000);
  }
});

function createMockResponse(
  status: number,
  body: unknown,
  contentType?: string,
): Response {
  const statusNum = Number(status);
  const hasBody = statusNum !== 204 && body !== undefined;
  const headers = new Headers();
  if (contentType) headers.set('Content-Type', contentType);
  const responseBody =
    hasBody && typeof body === 'string'
      ? body
      : hasBody
        ? JSON.stringify(body)
        : undefined;
  return new Response(responseBody, {
    status: statusNum,
    headers,
  });
}

function getMockResponse(
  operationId: string,
  statusCode: string,
  contentType: string | undefined,
): { body: unknown; contentType: string | undefined } {
  if (statusCode === '204') {
    return { body: undefined, contentType: undefined };
  }
  const key = `${operationId} ${statusCode} ${contentType ?? 'application/json'}`;
  const map: Record<string, { body: unknown; contentType: string }> = {
    'createOAuthToken 200 application/json': {
      body: m.mockOAuth200,
      contentType: 'application/json',
    },
    'createOAuthToken 400 application/json': {
      body: m.mockOAuth400,
      contentType: 'application/json',
    },
    'createOAuthToken 401 application/json': {
      body: m.mockOAuth401,
      contentType: 'application/json',
    },
    'getOpenapiSpec 200 application/yaml': {
      body: m.mockOpenapiYaml,
      contentType: 'application/yaml',
    },
    'getOpenapiSpec 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getOpenapiSpecJson 200 application/json': {
      body: m.mockOpenapiJson,
      contentType: 'application/json',
    },
    'getOpenapiSpecJson 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getPing 200 application/json': {
      body: m.mockPingResponse,
      contentType: 'application/json',
    },
    'getPing 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'presignUpload 201 application/json': {
      body: m.mockPresignResponse,
      contentType: 'application/json',
    },
    'presignUpload 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'presignUpload 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'presignUpload 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'createBlock 201 application/json': {
      body: m.mockTextBlock,
      contentType: 'application/json',
    },
    'createBlock 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlock 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlock 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlock 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlock 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'batchCreateBlocks 202 application/json': {
      body: m.mockBatchResponse,
      contentType: 'application/json',
    },
    'batchCreateBlocks 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'batchCreateBlocks 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'batchCreateBlocks 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'batchCreateBlocks 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'batchCreateBlocks 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'batchCreateBlocks 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getBatchStatus 200 application/json': {
      body: m.mockBatchStatus,
      contentType: 'application/json',
    },
    'getBatchStatus 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBatchStatus 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBatchStatus 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBatchStatus 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getBlock 200 application/json': {
      body: m.mockTextBlock,
      contentType: 'application/json',
    },
    'getBlock 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlock 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlock 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlock 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'updateBlock 200 application/json': {
      body: m.mockTextBlock,
      contentType: 'application/json',
    },
    'updateBlock 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateBlock 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateBlock 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateBlock 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateBlock 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateBlock 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getBlockConnections 200 application/json': {
      body: m.mockChannelListResponse,
      contentType: 'application/json',
    },
    'getBlockConnections 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlockConnections 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlockConnections 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlockConnections 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getBlockComments 200 application/json': {
      body: m.mockCommentListResponse,
      contentType: 'application/json',
    },
    'getBlockComments 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlockComments 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlockComments 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getBlockComments 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'createBlockComment 201 application/json': {
      body: m.mockComment,
      contentType: 'application/json',
    },
    'createBlockComment 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlockComment 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlockComment 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlockComment 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlockComment 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createBlockComment 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'deleteComment 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteComment 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteComment 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteComment 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'createChannel 201 application/json': {
      body: m.mockChannel,
      contentType: 'application/json',
    },
    'createChannel 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createChannel 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createChannel 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createChannel 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createChannel 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getChannel 200 application/json': {
      body: m.mockChannel,
      contentType: 'application/json',
    },
    'getChannel 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannel 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannel 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannel 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'updateChannel 200 application/json': {
      body: m.mockChannel,
      contentType: 'application/json',
    },
    'updateChannel 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateChannel 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateChannel 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateChannel 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateChannel 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'updateChannel 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'deleteChannel 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteChannel 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteChannel 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteChannel 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'createConnection 201 application/json': {
      body: m.mockCreateConnection201,
      contentType: 'application/json',
    },
    'createConnection 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createConnection 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createConnection 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createConnection 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createConnection 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'createConnection 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getConnection 200 application/json': {
      body: m.mockConnection,
      contentType: 'application/json',
    },
    'getConnection 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getConnection 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getConnection 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getConnection 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'deleteConnection 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteConnection 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteConnection 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'deleteConnection 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'moveConnection 200 application/json': {
      body: m.mockConnection,
      contentType: 'application/json',
    },
    'moveConnection 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'moveConnection 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'moveConnection 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'moveConnection 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'moveConnection 422 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'moveConnection 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getChannelContents 200 application/json': {
      body: m.mockConnectableListResponse,
      contentType: 'application/json',
    },
    'getChannelContents 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelContents 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelContents 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelContents 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getChannelConnections 200 application/json': {
      body: m.mockChannelListResponse,
      contentType: 'application/json',
    },
    'getChannelConnections 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelConnections 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelConnections 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelConnections 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getChannelFollowers 200 application/json': {
      body: m.mockUserListResponse,
      contentType: 'application/json',
    },
    'getChannelFollowers 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelFollowers 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelFollowers 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getChannelFollowers 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getCurrentUser 200 application/json': {
      body: m.mockUser,
      contentType: 'application/json',
    },
    'getCurrentUser 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getCurrentUser 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getUser 200 application/json': {
      body: m.mockUser,
      contentType: 'application/json',
    },
    'getUser 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUser 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUser 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUser 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getUserContents 200 application/json': {
      body: m.mockConnectableListResponse,
      contentType: 'application/json',
    },
    'getUserContents 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserContents 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserContents 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserContents 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getUserFollowers 200 application/json': {
      body: m.mockUserListResponse,
      contentType: 'application/json',
    },
    'getUserFollowers 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserFollowers 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserFollowers 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserFollowers 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getUserFollowing 200 application/json': {
      body: m.mockFollowableListResponse,
      contentType: 'application/json',
    },
    'getUserFollowing 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserFollowing 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserFollowing 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getUserFollowing 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getGroup 200 application/json': {
      body: m.mockGroup,
      contentType: 'application/json',
    },
    'getGroup 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroup 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroup 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroup 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getGroupContents 200 application/json': {
      body: m.mockConnectableListResponse,
      contentType: 'application/json',
    },
    'getGroupContents 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroupContents 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroupContents 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroupContents 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'getGroupFollowers 200 application/json': {
      body: m.mockUserListResponse,
      contentType: 'application/json',
    },
    'getGroupFollowers 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroupFollowers 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroupFollowers 404 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'getGroupFollowers 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
    'search 200 application/json': {
      body: m.mockEverythingListResponse,
      contentType: 'application/json',
    },
    'search 400 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'search 401 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'search 403 application/json': {
      body: m.mockError,
      contentType: 'application/json',
    },
    'search 429 application/json': {
      body: m.mockRateLimitError,
      contentType: 'application/json',
    },
  };
  const entry = map[key];
  return entry ?? { body: undefined, contentType: undefined };
}

describe('Mocked', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn<typeof globalThis, 'fetch'>>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  for (const operationId of operationIds) {
    const op = operations[operationId as keyof typeof operations];
    const responseEntries = Object.entries(op.response);

    describe(operationId, () => {
      for (const [statusCode, contentTypes] of responseEntries) {
        const mediaEntries = Object.entries(contentTypes);

        if (mediaEntries.length === 0) {
          it(statusCode, async () => {
            const { body, contentType } = getMockResponse(
              operationId,
              statusCode,
              undefined,
            );
            const statusNum = Number(statusCode);
            fetchSpy.mockImplementation(() =>
              Promise.resolve(createMockResponse(statusNum, body, contentType)),
            );
            const api = createArena({ plain: true });
            const fn = api[operationId as keyof typeof api] as (
              ...args: unknown[]
            ) => Promise<unknown>;
            const args = minimalArgs[operationId] ?? [];
            expect(async () => fn(...args)).not.toThrow();
            const result = await fn(...args);
            expect(result).toMatchSnapshot();
          });
        } else {
          for (const [contentType] of mediaEntries) {
            const scenarioName =
              mediaEntries.length > 1
                ? `${statusCode} ${contentType}`
                : statusCode;

            it(scenarioName, async () => {
              const { body, contentType: ct } = getMockResponse(
                operationId,
                statusCode,
                contentType,
              );
              const statusNum = Number(statusCode);
              fetchSpy.mockImplementation(() =>
                Promise.resolve(createMockResponse(statusNum, body, ct)),
              );
              const api = createArena({ plain: true });
              const fn = api[operationId as keyof typeof api] as (
                ...args: unknown[]
              ) => Promise<unknown>;
              const args = minimalArgs[operationId] ?? [];
              expect(async () => fn(...args)).not.toThrow();
              const result = await fn(...args);
              console.log(result);
              expect(result).toMatchSnapshot();
            });
          }
        }
      }
    });
  }
});
