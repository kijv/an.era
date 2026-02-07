/**
 * Minimal mock response bodies that match each OpenAPI response schema.
 * Used to test every status code / content-type scenario for each operation.
 */

const ts = '2020-01-01T00:00:00.000Z';
const url = 'https://api.are.na/v3/';

const embeddedUser = {
  id: 1,
  type: 'User' as const,
  name: 'Mock User',
  slug: 'mock-user',
  avatar: null as string | null,
  initials: 'MU',
};

const embeddedGroup = {
  id: 1,
  type: 'Group' as const,
  name: 'Mock Group',
  slug: 'mock-group',
  avatar: null as string | null,
  initials: 'MG',
};

const link = { href: url };
const links = { self: link };
const markdownContent = { markdown: 'x', html: '<p>x</p>', plain: 'x' };
const paginationMeta = {
  current_page: 1,
  per_page: 10,
  total_pages: 1,
  total_count: 0,
  has_more_pages: false,
};

const imageVersion = { src: url, src_2x: url };
const blockImage = {
  small: imageVersion,
  medium: imageVersion,
  large: imageVersion,
  square: imageVersion,
};

const baseBlockProps = {
  id: 1,
  base_type: 'Block' as const,
  state: 'available' as const,
  visibility: 'public' as const,
  comment_count: 0,
  created_at: ts,
  updated_at: ts,
  user: embeddedUser,
  _links: links,
};

export const mockError = {
  error: 'mock_error',
  code: 400,
};

export const mockRateLimitError = {
  error: {
    type: 'rate_limit',
    message: 'Too many requests',
    tier: 'free' as const,
    limit: 60,
    retry_after: 42,
    suggestions: ['Upgrade your plan'],
  },
};

export const mockPingResponse = { status: 'ok' as const };

export const mockOAuth200 = {
  access_token: 'mock-token',
  token_type: 'Bearer' as const,
  scope: 'public',
  created_at: 0,
};

export const mockOAuth400 = {
  error: 'invalid_request' as const,
  error_description: 'Bad request',
};

export const mockOAuth401 = {
  error: 'unauthorized',
  error_description: 'Invalid credentials',
};

export const mockTextBlock = {
  ...baseBlockProps,
  type: 'Text' as const,
  content: markdownContent,
};

export const mockImageBlock = {
  ...baseBlockProps,
  id: 2,
  type: 'Image' as const,
  image: blockImage,
};

export const mockLinkBlock = {
  ...baseBlockProps,
  id: 3,
  type: 'Link' as const,
};

export const mockAttachmentBlock = {
  ...baseBlockProps,
  id: 4,
  type: 'Attachment' as const,
  attachment: { url },
};

export const mockEmbedBlock = {
  ...baseBlockProps,
  id: 5,
  type: 'Embed' as const,
  embed: {},
};

export const mockPendingBlock = {
  ...baseBlockProps,
  id: 6,
  type: 'PendingBlock' as const,
};

export const mockChannel = {
  id: 1,
  type: 'Channel' as const,
  slug: 'mock-channel',
  title: 'Mock Channel',
  state: 'available' as const,
  visibility: 'public' as const,
  created_at: ts,
  updated_at: ts,
  owner: embeddedUser,
  counts: { blocks: 0, channels: 0, contents: 0, collaborators: 0 },
  _links: links,
};

export const mockComment = {
  id: 1,
  type: 'Comment' as const,
  created_at: ts,
  updated_at: ts,
  user: embeddedUser,
  _links: links,
};

export const mockConnection = {
  id: 1,
  position: 0,
  pinned: false,
  connected_at: ts,
  connected_by: embeddedUser,
  can: { remove: true },
  _links: links,
};

export const mockUser = {
  ...embeddedUser,
  created_at: ts,
  updated_at: ts,
  counts: { channels: 0, followers: 0, following: 0 },
  _links: links,
};

export const mockGroup = {
  ...embeddedGroup,
  created_at: ts,
  updated_at: ts,
  user: embeddedUser,
  counts: { channels: 0, users: 0 },
  _links: links,
};

export const mockChannelListResponse = {
  data: [mockChannel],
  meta: paginationMeta,
};

export const mockCommentListResponse = {
  data: [mockComment],
  meta: paginationMeta,
};

export const mockUserListResponse = {
  data: [mockUser],
  meta: paginationMeta,
};

export const mockFollowableListResponse = {
  data: [mockUser],
  meta: paginationMeta,
};

/** All block types for list responses that can return mixed blocks. */
export const mockBlocks = [
  mockTextBlock,
  mockImageBlock,
  mockLinkBlock,
  mockAttachmentBlock,
  mockEmbedBlock,
  mockPendingBlock,
];

export const mockConnectableListResponse = {
  data: mockBlocks,
  meta: paginationMeta,
};

export const mockEverythingListResponse = {
  data: [...mockBlocks, mockChannel, mockUser, mockGroup],
  meta: paginationMeta,
};

export const mockBulkBlockResponse = {
  data: {
    successful: mockBlocks.map((block, i) => ({ index: i, block })),
    failed: [],
  },
  meta: {
    total: mockBlocks.length,
    successful_count: mockBlocks.length,
    failed_count: 0,
  },
};

export const mockCreateConnection201 = { data: [mockConnection] };

export const mockOpenapiYaml = 'openapi: "3.0.0"\ninfo:\n  title: Mock\n';

export const mockOpenapiJson = {};

/** Status 204 has no body */
export const mock204 = undefined;
