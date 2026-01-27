import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createArena } from '../src';

let arena: ReturnType<typeof createArena>;
let fetchMock: Mock;
let originalFetch: typeof global.fetch;

// Mock data factories
const mockEmbeddedUser = () => ({
  id: 12345,
  type: 'User' as const,
  name: 'Test User',
  slug: 'test-user',
  avatar: null,
  initials: 'TU',
});

const mockLinks = () => ({
  self: { href: 'https://api.are.na/v3/test' },
});

const mockUserCounts = () => ({
  channels: 10,
  followers: 5,
  following: 3,
});

const mockGroupCounts = () => ({
  channels: 5,
  users: 3,
});

const mockChannelCounts = () => ({
  blocks: 10,
  channels: 2,
  contents: 12,
  collaborators: 1,
});

const mockPaginationMeta = () => ({
  current_page: 1,
  next_page: null,
  prev_page: null,
  per_page: 25,
  total_pages: 1,
  total_count: 0,
  has_more_pages: false,
});

const mockChannel = () => ({
  id: 123,
  type: 'Channel' as const,
  slug: 'test-channel',
  title: 'Test Channel',
  state: 'available' as const,
  visibility: 'public' as const,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  owner: mockEmbeddedUser(),
  counts: mockChannelCounts(),
  _links: mockLinks(),
});

const mockImageVersion = () => ({
  src: 'https://example.com/image.jpg',
  src_1x: 'https://example.com/image.jpg',
  src_2x: 'https://example.com/image@2x.jpg',
});

const mockBlockImage = () => ({
  content_type: 'image/jpeg',
  filename: 'image.jpg',
  small: mockImageVersion(),
  medium: mockImageVersion(),
  large: mockImageVersion(),
  square: mockImageVersion(),
});

const mockImageBlock = () => ({
  id: 8693,
  base_type: 'Block' as const,
  type: 'Image' as const,
  state: 'available' as const,
  visibility: 'public' as const,
  comment_count: 0,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  user: mockEmbeddedUser(),
  _links: mockLinks(),
  image: mockBlockImage(),
});

const mockUser = () => ({
  ...mockEmbeddedUser(),
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  counts: mockUserCounts(),
  _links: mockLinks(),
});

const mockGroup = () => ({
  id: 67890,
  type: 'Group' as const,
  name: 'Test Group',
  slug: 'test-group',
  avatar: null,
  initials: 'TG',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  user: mockEmbeddedUser(),
  counts: mockGroupCounts(),
  _links: mockLinks(),
});

const mockComment = () => ({
  id: 111,
  type: 'Comment' as const,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  user: mockEmbeddedUser(),
  _links: mockLinks(),
});

// Helper to create mock response
const mockResponse = (data: object) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

beforeEach(() => {
  originalFetch = global.fetch;
  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
  arena = createArena({ baseUrl: 'https://api.are.na' });
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

// Helper to get the fetch call details for snapshotting
const getCallDetails = (mock: Mock) => {
  const call = mock.mock.calls[0] as [URL, RequestInit];
  return {
    pathname: call[0].pathname,
    search: call[0].search,
    method: call[1]?.method,
  };
};

// Helper to assert result is not an error response
const expectNotError = (result: unknown)  => {
  expect(result).not.toHaveProperty('error');
  expect(result).not.toHaveProperty('code');
};

describe('Arena', () => {
  it('createArena should return an object', () => {
    expect(createArena()).toBeTypeOf('object');
  });

  describe('.channels(slug)', () => {
    it('.self() should retrieve a channel', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse(mockChannel()));

      const result = await arena.channels('arena-influences').self();

      expectNotError(result);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('slug');
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/channels/arena-influences",
          "search": "",
        }
      `);
    });

    it('.contents() should get contents as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockImageBlock(), mockChannel()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.channels('arena-influences').contents();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/channels/arena-influences/contents",
          "search": "",
        }
      `);
    });

    it('.contents() with pagination should pass query params', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.channels('arena-influences').contents({ page: 3, per: 10 });

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/channels/arena-influences/contents",
          "search": "?page=3&per=10",
        }
      `);
    });

    it('.connections() should get the connections in the channel', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockChannel()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.channels('arena-influences').connections();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/channels/arena-influences/connections",
          "search": "",
        }
      `);
    });

    it('.followers() should get followers as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockUser()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.channels('arena-influences').followers();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/channels/arena-influences/followers",
          "search": "",
        }
      `);
    });
  });

  describe('.blocks(id)', () => {
    it('.self() should get the block', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse(mockImageBlock()));

      const result = await arena.blocks(8693).self();

      expectNotError(result);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('type');
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/blocks/8693",
          "search": "",
        }
      `);
    });

    it('.connections() should get the channels the block belongs to', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockChannel()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.blocks(8693).connections();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/blocks/8693/connections",
          "search": "",
        }
      `);
    });

    it('.comments() should get comments as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockComment()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.blocks(8693).comments();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/blocks/8693/comments",
          "search": "",
        }
      `);
    });
  });

  describe('.users(id)', () => {
    it('.self() should get the user', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse(mockUser()));

      const result = await arena.users('23484').self();

      expectNotError(result);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('slug');
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/users/23484",
          "search": "",
        }
      `);
    });

    it('.contents() should get user contents as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockImageBlock()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.users('23484').contents();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/users/23484/contents",
          "search": "",
        }
      `);
    });

    it('.followers() should get followers as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockUser()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.users('23484').followers();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/users/23484/followers",
          "search": "",
        }
      `);
    });

    it('.following() should get following as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockUser(), mockChannel()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.users('23484').following();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/users/23484/following",
          "search": "",
        }
      `);
    });
  });

  describe('.users.getCurrentUser()', () => {
    it('should get the current user', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse(mockUser()));

      const result = await arena.users.getCurrentUser();

      expectNotError(result);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('slug');
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/me",
          "search": "",
        }
      `);
    });
  });

  describe('.groups(slug)', () => {
    it('.self() should get the group', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse(mockGroup()));

      const result = await arena.groups('are-na-team').self();

      expectNotError(result);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/groups/are-na-team",
          "search": "",
        }
      `);
    });

    it('.contents() should get group contents as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockImageBlock()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.groups('are-na-team').contents();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/groups/are-na-team/contents",
          "search": "",
        }
      `);
    });

    it('.followers() should get followers as an array', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockUser()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.groups('are-na-team').followers();

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/groups/are-na-team/followers",
          "search": "",
        }
      `);
    });
  });

  describe('.search(query)', () => {
    it('should search and return results', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockImageBlock(), mockChannel(), mockUser()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.search({ q: 'art' });

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/search",
          "search": "?q=art",
        }
      `);
    });

    it('should search with type filter', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({
        data: [mockImageBlock()],
        meta: mockPaginationMeta(),
      }));

      const result = await arena.search({ q: 'art', type: ['Image', 'Link'] });

      expectNotError(result);
      expect(result.data).toBeInstanceOf(Array);
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/search",
          "search": "?q=art&type=Image%2CLink",
        }
      `);
    });
  });

  describe('.system', () => {
    it('.ping() should return status ok', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({ status: 'ok' }));

      const result = await arena.system.ping();

      expectNotError(result);
      expect(result).toHaveProperty('status', 'ok');
      expect(getCallDetails(fetchMock)).toMatchInlineSnapshot(`
        {
          "method": "get",
          "pathname": "/v3/ping",
          "search": "",
        }
      `);
    });
  });
});
