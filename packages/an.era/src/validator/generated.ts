/**
 * Auto-generated Valibot validators from OpenAPI spec.
 * Do not edit by hand.
 */

import * as v from 'valibot';
import { sValidator } from '@hono/standard-validator';

const errorSchema = v.looseObject({
  error: v.string(),
  code: v.pipe(v.number(), v.integer()),
  details: v.optional(v.looseObject({ message: v.optional(v.string()) })),
});
const userTierSchema = v.picklist(['guest', 'free', 'premium', 'supporter']);
const rateLimitErrorSchema = v.looseObject({
  error: v.looseObject({
    type: v.string(),
    message: v.string(),
    tier: userTierSchema,
    limit: v.pipe(v.number(), v.integer()),
    limit_window: v.optional(v.string()),
    retry_after: v.pipe(v.number(), v.integer()),
    current_status: v.optional(
      v.looseObject({
        tier: v.optional(v.string()),
        limits: v.optional(v.looseObject({})),
        upgrade_path: v.optional(
          v.looseObject({
            current: v.optional(v.string()),
            recommended: v.optional(v.string()),
            benefits: v.optional(v.array(v.string())),
            action: v.optional(v.string()),
          }),
        ),
      }),
    ),
    suggestions: v.array(v.string()),
    headers_note: v.optional(v.string()),
  }),
});
const linkSchema = v.looseObject({ href: v.pipe(v.string(), v.url()) });
const linksSchema = v.looseObject({ self: linkSchema });
const markdownContentSchema = v.looseObject({
  markdown: v.string(),
  html: v.string(),
  plain: v.string(),
});
const embeddedUserSchema = v.looseObject({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('User'),
  name: v.string(),
  slug: v.string(),
  avatar: v.unknown(),
  initials: v.string(),
});
const embeddedConnectionSchema = v.looseObject({
  id: v.pipe(v.number(), v.integer()),
  position: v.pipe(v.number(), v.integer()),
  pinned: v.boolean(),
  connected_at: v.pipe(v.string(), v.isoTimestamp()),
  connected_by: v.union([embeddedUserSchema, v.null()]),
});
const connectionAbilitiesSchema = v.looseObject({ remove: v.boolean() });
const connectionSchema = v.intersect([
  embeddedConnectionSchema,
  v.looseObject({ can: connectionAbilitiesSchema, _links: linksSchema }),
]);
const embeddedGroupSchema = v.looseObject({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('Group'),
  name: v.string(),
  slug: v.string(),
  avatar: v.unknown(),
  initials: v.string(),
});
const userBadgeSchema = v.picklist([
  'staff',
  'investor',
  'supporter',
  'premium',
]);
const userCountsSchema = v.looseObject({
  channels: v.pipe(v.number(), v.integer()),
  followers: v.pipe(v.number(), v.integer()),
  following: v.pipe(v.number(), v.integer()),
});
const userSchema = v.intersect([
  embeddedUserSchema,
  v.looseObject({
    created_at: v.pipe(v.string(), v.isoTimestamp()),
    updated_at: v.pipe(v.string(), v.isoTimestamp()),
    bio: v.optional(v.nullable(v.union([markdownContentSchema, v.null()]))),
    badge: v.union([userBadgeSchema, v.null()]),
    tier: userTierSchema,
    counts: userCountsSchema,
    _links: linksSchema,
  }),
]);
const groupCountsSchema = v.looseObject({
  channels: v.pipe(v.number(), v.integer()),
  users: v.pipe(v.number(), v.integer()),
});
const groupSchema = v.intersect([
  embeddedGroupSchema,
  v.looseObject({
    bio: v.optional(v.nullable(v.union([markdownContentSchema, v.null()]))),
    created_at: v.pipe(v.string(), v.isoTimestamp()),
    updated_at: v.pipe(v.string(), v.isoTimestamp()),
    user: embeddedUserSchema,
    counts: groupCountsSchema,
    _links: linksSchema,
  }),
]);
const blockStateSchema = v.picklist(['processing', 'available', 'failed']);
const blockVisibilitySchema = v.picklist(['public', 'private', 'orphan']);
const channelStateSchema = v.picklist(['available', 'deleted']);
const connectionFilterSchema = v.picklist(['ALL', 'OWN', 'EXCLUDE_OWN']);
const followableTypeSchema = v.picklist(['User', 'Channel', 'Group']);
const connectableTypeSchema = v.picklist(['Block', 'Channel']);
const contentTypeFilterSchema = v.picklist([
  'Text',
  'Image',
  'Link',
  'Attachment',
  'Embed',
  'Channel',
  'Block',
]);
const searchTypeFilterSchema = v.picklist([
  'All',
  'Text',
  'Image',
  'Link',
  'Attachment',
  'Embed',
  'Channel',
  'Block',
  'User',
  'Group',
]);
const fileExtensionSchema = v.picklist([
  'aac',
  'ai',
  'aiff',
  'avi',
  'avif',
  'bmp',
  'csv',
  'doc',
  'docx',
  'eps',
  'epub',
  'fla',
  'gif',
  'h264',
  'heic',
  'heif',
  'ind',
  'indd',
  'jpeg',
  'jpg',
  'key',
  'kml',
  'kmz',
  'latex',
  'm4a',
  'ma',
  'mb',
  'mid',
  'midi',
  'mov',
  'mp3',
  'mp4',
  'mp4v',
  'mpeg',
  'mpg',
  'mpg4',
  'numbers',
  'oga',
  'ogg',
  'ogv',
  'otf',
  'pages',
  'pdf',
  'pgp',
  'png',
  'ppt',
  'pptx',
  'psd',
  'svg',
  'swa',
  'swf',
  'tex',
  'texi',
  'texinfo',
  'tfm',
  'tif',
  'tiff',
  'torrent',
  'ttc',
  'ttf',
  'txt',
  'wav',
  'webm',
  'webp',
  'wma',
  'xls',
  'xlsx',
  'xlt',
]);
const connectionSortSchema = v.picklist(['created_at_desc', 'created_at_asc']);
const channelContentSortSchema = v.picklist([
  'position_asc',
  'position_desc',
  'created_at_asc',
  'created_at_desc',
  'updated_at_asc',
  'updated_at_desc',
]);
const contentSortSchema = v.picklist([
  'created_at_asc',
  'created_at_desc',
  'updated_at_asc',
  'updated_at_desc',
]);
const searchScopeSchema = v.picklist(['all', 'my', 'following']);
const searchSortSchema = v.picklist([
  'score_desc',
  'created_at_desc',
  'created_at_asc',
  'updated_at_desc',
  'updated_at_asc',
  'name_asc',
  'name_desc',
  'connections_count_desc',
  'random',
]);
const channelVisibilitySchema = v.picklist(['public', 'private', 'closed']);
const movementSchema = v.picklist([
  'insert_at',
  'move_to_top',
  'move_to_bottom',
  'move_up',
  'move_down',
]);
const channelIdsSchema = v.pipe(
  v.array(v.union([v.pipe(v.number(), v.integer()), v.string()])),
  v.minLength(1),
  v.maxLength(20),
);
const presignedFileSchema = v.looseObject({
  upload_url: v.pipe(v.string(), v.url()),
  key: v.string(),
  content_type: v.string(),
});
const presignResponseSchema = v.looseObject({
  files: v.array(presignedFileSchema),
  expires_in: v.pipe(v.number(), v.integer()),
});
const blockInputSchema = v.looseObject({
  value: v.string(),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  original_source_url: v.optional(v.pipe(v.string(), v.url())),
  original_source_title: v.optional(v.string()),
  alt_text: v.optional(v.string()),
});
const batchResponseSchema = v.looseObject({
  batch_id: v.pipe(v.string(), v.uuid()),
  status: v.literal('pending'),
  total: v.pipe(v.number(), v.integer()),
});
const batchStatusSchema = v.looseObject({
  batch_id: v.pipe(v.string(), v.uuid()),
  status: v.picklist(['pending', 'processing', 'completed', 'failed']),
  total: v.pipe(v.number(), v.integer()),
  successful_count: v.pipe(v.number(), v.integer()),
  failed_count: v.pipe(v.number(), v.integer()),
  successful: v.optional(
    v.array(
      v.looseObject({
        index: v.pipe(v.number(), v.integer()),
        block_id: v.pipe(v.number(), v.integer()),
      }),
    ),
  ),
  failed: v.optional(
    v.array(
      v.looseObject({
        index: v.pipe(v.number(), v.integer()),
        error: v.string(),
      }),
    ),
  ),
  created_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  completed_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  error: v.optional(v.string()),
});
const blockProviderSchema = v.looseObject({
  name: v.string(),
  url: v.pipe(v.string(), v.url()),
});
const blockSourceSchema = v.looseObject({
  url: v.pipe(v.string(), v.url()),
  title: v.optional(v.unknown()),
  provider: v.optional(v.nullable(v.union([blockProviderSchema, v.null()]))),
});
const blockAbilitiesSchema = v.looseObject({
  manage: v.boolean(),
  comment: v.boolean(),
  connect: v.boolean(),
});
const baseBlockPropertiesSchema = v.looseObject({
  id: v.pipe(v.number(), v.integer()),
  base_type: v.literal('Block'),
  title: v.optional(v.unknown()),
  description: v.optional(
    v.nullable(v.union([markdownContentSchema, v.null()])),
  ),
  state: blockStateSchema,
  visibility: blockVisibilitySchema,
  comment_count: v.pipe(v.number(), v.integer()),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  user: embeddedUserSchema,
  source: v.optional(v.nullable(v.union([blockSourceSchema, v.null()]))),
  _links: linksSchema,
  connection: v.optional(
    v.nullable(v.union([embeddedConnectionSchema, v.null()])),
  ),
  can: v.optional(v.nullable(v.union([blockAbilitiesSchema, v.null()]))),
});
const textBlockSchema = v.intersect([
  baseBlockPropertiesSchema,
  v.looseObject({ type: v.literal('Text'), content: markdownContentSchema }),
  v.looseObject({ type: v.literal('Text') }),
]);
const imageVersionSchema = v.looseObject({
  src: v.pipe(v.string(), v.url()),
  src_2x: v.pipe(v.string(), v.url()),
  width: v.optional(v.unknown()),
  height: v.optional(v.unknown()),
});
const blockImageSchema = v.looseObject({
  alt_text: v.optional(v.unknown()),
  blurhash: v.optional(v.unknown()),
  width: v.optional(v.unknown()),
  height: v.optional(v.unknown()),
  src: v.optional(v.pipe(v.string(), v.url())),
  aspect_ratio: v.optional(v.unknown()),
  content_type: v.optional(v.string()),
  filename: v.optional(v.string()),
  file_size: v.optional(v.unknown()),
  updated_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  small: imageVersionSchema,
  medium: imageVersionSchema,
  large: imageVersionSchema,
  square: imageVersionSchema,
});
const imageBlockSchema = v.intersect([
  baseBlockPropertiesSchema,
  v.looseObject({ type: v.literal('Image'), image: blockImageSchema }),
  v.looseObject({ type: v.literal('Image') }),
]);
const linkBlockSchema = v.intersect([
  baseBlockPropertiesSchema,
  v.looseObject({
    type: v.literal('Link'),
    image: v.optional(v.nullable(v.union([blockImageSchema, v.null()]))),
    content: v.optional(v.nullable(v.union([markdownContentSchema, v.null()]))),
  }),
  v.looseObject({ type: v.literal('Link') }),
]);
const blockAttachmentSchema = v.looseObject({
  filename: v.optional(v.unknown()),
  content_type: v.optional(v.unknown()),
  file_size: v.optional(v.unknown()),
  file_extension: v.optional(v.unknown()),
  updated_at: v.optional(v.unknown()),
  url: v.pipe(v.string(), v.url()),
});
const attachmentBlockSchema = v.intersect([
  baseBlockPropertiesSchema,
  v.looseObject({
    type: v.literal('Attachment'),
    attachment: blockAttachmentSchema,
    image: v.optional(v.nullable(v.union([blockImageSchema, v.null()]))),
  }),
  v.looseObject({ type: v.literal('Attachment') }),
]);
const blockEmbedSchema = v.looseObject({
  url: v.optional(v.unknown()),
  type: v.optional(v.unknown()),
  title: v.optional(v.unknown()),
  author_name: v.optional(v.unknown()),
  author_url: v.optional(v.unknown()),
  source_url: v.optional(v.unknown()),
  width: v.optional(v.unknown()),
  height: v.optional(v.unknown()),
  html: v.optional(v.unknown()),
  thumbnail_url: v.optional(v.unknown()),
});
const embedBlockSchema = v.intersect([
  baseBlockPropertiesSchema,
  v.looseObject({
    type: v.literal('Embed'),
    embed: blockEmbedSchema,
    image: v.optional(v.nullable(v.union([blockImageSchema, v.null()]))),
  }),
  v.looseObject({ type: v.literal('Embed') }),
]);
const pendingBlockSchema = v.intersect([
  baseBlockPropertiesSchema,
  v.looseObject({ type: v.literal('PendingBlock') }),
]);
const blockSchema = v.union([
  textBlockSchema,
  imageBlockSchema,
  linkBlockSchema,
  attachmentBlockSchema,
  embedBlockSchema,
  pendingBlockSchema,
]);
const commentSchema = v.looseObject({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('Comment'),
  body: v.optional(v.nullable(v.union([markdownContentSchema, v.null()]))),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  user: embeddedUserSchema,
  _links: linksSchema,
});
const channelOwnerSchema = v.union([embeddedUserSchema, embeddedGroupSchema]);
const channelCountsSchema = v.looseObject({
  blocks: v.pipe(v.number(), v.integer()),
  channels: v.pipe(v.number(), v.integer()),
  contents: v.pipe(v.number(), v.integer()),
  collaborators: v.pipe(v.number(), v.integer()),
});
const channelCollaboratorSchema = v.union([
  embeddedUserSchema,
  embeddedGroupSchema,
]);
const channelAbilitiesSchema = v.looseObject({
  add_to: v.boolean(),
  update: v.boolean(),
  destroy: v.boolean(),
  manage_collaborators: v.boolean(),
});
const channelSchema = v.looseObject({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('Channel'),
  slug: v.string(),
  title: v.string(),
  description: v.optional(
    v.nullable(v.union([markdownContentSchema, v.null()])),
  ),
  state: channelStateSchema,
  visibility: channelVisibilitySchema,
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  owner: channelOwnerSchema,
  counts: channelCountsSchema,
  collaborators: v.optional(v.array(channelCollaboratorSchema)),
  _links: linksSchema,
  connection: v.optional(
    v.nullable(v.union([embeddedConnectionSchema, v.null()])),
  ),
  can: v.optional(v.nullable(v.union([channelAbilitiesSchema, v.null()]))),
});
const paginationMetaSchema = v.looseObject({
  current_page: v.pipe(v.number(), v.integer()),
  next_page: v.optional(v.unknown()),
  prev_page: v.optional(v.unknown()),
  per_page: v.pipe(v.number(), v.integer()),
  total_pages: v.pipe(v.number(), v.integer()),
  total_count: v.pipe(v.number(), v.integer()),
  has_more_pages: v.boolean(),
});
const paginatedResponseSchema = v.looseObject({ meta: paginationMetaSchema });
const userListSchema = v.looseObject({ data: v.array(userSchema) });
const channelListSchema = v.looseObject({ data: v.array(channelSchema) });
const connectableListSchema = v.looseObject({
  data: v.array(
    v.union([
      textBlockSchema,
      imageBlockSchema,
      linkBlockSchema,
      attachmentBlockSchema,
      embedBlockSchema,
      channelSchema,
    ]),
  ),
});
const followableListSchema = v.looseObject({
  data: v.array(v.union([userSchema, channelSchema, groupSchema])),
});
const everythingListSchema = v.looseObject({
  data: v.array(
    v.union([
      textBlockSchema,
      imageBlockSchema,
      linkBlockSchema,
      attachmentBlockSchema,
      embedBlockSchema,
      channelSchema,
      userSchema,
      groupSchema,
    ]),
  ),
});
const userListResponseSchema = v.intersect([
  userListSchema,
  paginatedResponseSchema,
]);
const channelListResponseSchema = v.intersect([
  channelListSchema,
  paginatedResponseSchema,
]);
const connectableListResponseSchema = v.intersect([
  connectableListSchema,
  paginatedResponseSchema,
]);
const followableListResponseSchema = v.intersect([
  followableListSchema,
  paginatedResponseSchema,
]);
const everythingListResponseSchema = v.intersect([
  everythingListSchema,
  paginatedResponseSchema,
]);
const commentListSchema = v.looseObject({ data: v.array(commentSchema) });
const commentListResponseSchema = v.intersect([
  commentListSchema,
  paginatedResponseSchema,
]);
const pingResponseSchema = v.looseObject({ status: v.literal('ok') });
const pageParamParamSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const perParamParamSchema = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(1),
  v.maxValue(100),
);
const idParamParamSchema = v.pipe(v.number(), v.integer());
const slugOrIdParamParamSchema = v.string();
const connectionSortParamParamSchema = connectionSortSchema;
const contentSortParamParamSchema = contentSortSchema;
const channelContentSortParamParamSchema = channelContentSortSchema;
const contentTypeFilterParamParamSchema = contentTypeFilterSchema;
const createOAuthTokenRequestSchema = v.looseObject({
  grant_type: v.picklist(['authorization_code', 'client_credentials']),
  client_id: v.optional(v.string()),
  client_secret: v.optional(v.string()),
  code: v.optional(v.string()),
  redirect_uri: v.optional(v.pipe(v.string(), v.url())),
  code_verifier: v.optional(v.string()),
});
const createOAuthTokenResponseSchema = v.looseObject({
  access_token: v.string(),
  token_type: v.literal('Bearer'),
  scope: v.string(),
  created_at: v.pipe(v.number(), v.integer()),
});
const getOpenapiSpecResponseSchema = v.string();
const getOpenapiSpecJsonResponseSchema = v.looseObject({});
const getPingResponseSchema = pingResponseSchema;
const presignUploadRequestSchema = v.looseObject({
  files: v.pipe(
    v.array(v.looseObject({ filename: v.string(), content_type: v.string() })),
    v.minLength(1),
    v.maxLength(50),
  ),
});
const presignUploadResponseSchema = presignResponseSchema;
const createBlockRequestSchema = v.intersect([
  blockInputSchema,
  v.looseObject({
    channel_ids: channelIdsSchema,
    insert_at: v.optional(v.pipe(v.number(), v.integer())),
  }),
]);
const createBlockResponseSchema = blockSchema;
const batchCreateBlocksRequestSchema = v.looseObject({
  channel_ids: channelIdsSchema,
  blocks: v.pipe(v.array(blockInputSchema), v.minLength(1), v.maxLength(50)),
});
const batchCreateBlocksResponseSchema = batchResponseSchema;
const getBatchStatusResponseSchema = batchStatusSchema;
const getBlockResponseSchema = blockSchema;
const updateBlockRequestSchema = v.looseObject({
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  content: v.optional(v.string()),
  alt_text: v.optional(v.string()),
});
const updateBlockResponseSchema = blockSchema;
const getBlockConnectionsResponseSchema = channelListResponseSchema;
const getBlockCommentsResponseSchema = commentListResponseSchema;
const createBlockCommentRequestSchema = v.looseObject({ body: v.string() });
const createBlockCommentResponseSchema = commentSchema;
const createChannelRequestSchema = v.looseObject({
  title: v.string(),
  visibility: v.optional(channelVisibilitySchema),
  description: v.optional(v.string()),
  group_id: v.optional(v.pipe(v.number(), v.integer())),
});
const createChannelResponseSchema = channelSchema;
const getChannelResponseSchema = channelSchema;
const updateChannelRequestSchema = v.looseObject({
  title: v.optional(v.string()),
  visibility: v.optional(channelVisibilitySchema),
  description: v.optional(v.unknown()),
});
const updateChannelResponseSchema = channelSchema;
const createConnectionRequestSchema = v.looseObject({
  connectable_id: v.pipe(v.number(), v.integer()),
  connectable_type: connectableTypeSchema,
  channel_ids: channelIdsSchema,
  position: v.optional(v.pipe(v.number(), v.integer())),
});
const createConnectionResponseSchema = v.looseObject({
  data: v.optional(v.array(connectionSchema)),
});
const getConnectionResponseSchema = connectionSchema;
const moveConnectionRequestSchema = v.looseObject({
  movement: v.optional(movementSchema),
  position: v.optional(v.pipe(v.number(), v.integer())),
});
const moveConnectionResponseSchema = connectionSchema;
const getChannelContentsResponseSchema = connectableListResponseSchema;
const getChannelConnectionsResponseSchema = channelListResponseSchema;
const getChannelFollowersResponseSchema = userListResponseSchema;
const getCurrentUserResponseSchema = userSchema;
const getUserResponseSchema = userSchema;
const getUserContentsResponseSchema = connectableListResponseSchema;
const getUserFollowersResponseSchema = userListResponseSchema;
const getUserFollowingResponseSchema = followableListResponseSchema;
const getGroupResponseSchema = groupSchema;
const getGroupContentsResponseSchema = connectableListResponseSchema;
const getGroupFollowersResponseSchema = userListResponseSchema;
const searchResponseSchema = everythingListResponseSchema;

export const error = sValidator('json', {
  '~standard': errorSchema['~standard'],
});
export const userTier = sValidator('json', {
  '~standard': userTierSchema['~standard'],
});
export const rateLimitError = sValidator('json', {
  '~standard': rateLimitErrorSchema['~standard'],
});
export const link = sValidator('json', {
  '~standard': linkSchema['~standard'],
});
export const links = sValidator('json', {
  '~standard': linksSchema['~standard'],
});
export const markdownContent = sValidator('json', {
  '~standard': markdownContentSchema['~standard'],
});
export const embeddedUser = sValidator('json', {
  '~standard': embeddedUserSchema['~standard'],
});
export const embeddedConnection = sValidator('json', {
  '~standard': embeddedConnectionSchema['~standard'],
});
export const connectionAbilities = sValidator('json', {
  '~standard': connectionAbilitiesSchema['~standard'],
});
export const connection = sValidator('json', {
  '~standard': connectionSchema['~standard'],
});
export const embeddedGroup = sValidator('json', {
  '~standard': embeddedGroupSchema['~standard'],
});
export const userBadge = sValidator('json', {
  '~standard': userBadgeSchema['~standard'],
});
export const userCounts = sValidator('json', {
  '~standard': userCountsSchema['~standard'],
});
export const user = sValidator('json', {
  '~standard': userSchema['~standard'],
});
export const groupCounts = sValidator('json', {
  '~standard': groupCountsSchema['~standard'],
});
export const group = sValidator('json', {
  '~standard': groupSchema['~standard'],
});
export const blockState = sValidator('json', {
  '~standard': blockStateSchema['~standard'],
});
export const blockVisibility = sValidator('json', {
  '~standard': blockVisibilitySchema['~standard'],
});
export const channelState = sValidator('json', {
  '~standard': channelStateSchema['~standard'],
});
export const connectionFilter = sValidator('json', {
  '~standard': connectionFilterSchema['~standard'],
});
export const followableType = sValidator('json', {
  '~standard': followableTypeSchema['~standard'],
});
export const connectableType = sValidator('json', {
  '~standard': connectableTypeSchema['~standard'],
});
export const contentTypeFilter = sValidator('json', {
  '~standard': contentTypeFilterSchema['~standard'],
});
export const searchTypeFilter = sValidator('json', {
  '~standard': searchTypeFilterSchema['~standard'],
});
export const fileExtension = sValidator('json', {
  '~standard': fileExtensionSchema['~standard'],
});
export const connectionSort = sValidator('json', {
  '~standard': connectionSortSchema['~standard'],
});
export const channelContentSort = sValidator('json', {
  '~standard': channelContentSortSchema['~standard'],
});
export const contentSort = sValidator('json', {
  '~standard': contentSortSchema['~standard'],
});
export const searchScope = sValidator('json', {
  '~standard': searchScopeSchema['~standard'],
});
export const searchSort = sValidator('json', {
  '~standard': searchSortSchema['~standard'],
});
export const channelVisibility = sValidator('json', {
  '~standard': channelVisibilitySchema['~standard'],
});
export const movement = sValidator('json', {
  '~standard': movementSchema['~standard'],
});
export const channelIds = sValidator('json', {
  '~standard': channelIdsSchema['~standard'],
});
export const presignedFile = sValidator('json', {
  '~standard': presignedFileSchema['~standard'],
});
export const presignResponse = sValidator('json', {
  '~standard': presignResponseSchema['~standard'],
});
export const blockInput = sValidator('json', {
  '~standard': blockInputSchema['~standard'],
});
export const batchResponse = sValidator('json', {
  '~standard': batchResponseSchema['~standard'],
});
export const batchStatus = sValidator('json', {
  '~standard': batchStatusSchema['~standard'],
});
export const blockProvider = sValidator('json', {
  '~standard': blockProviderSchema['~standard'],
});
export const blockSource = sValidator('json', {
  '~standard': blockSourceSchema['~standard'],
});
export const blockAbilities = sValidator('json', {
  '~standard': blockAbilitiesSchema['~standard'],
});
export const baseBlockProperties = sValidator('json', {
  '~standard': baseBlockPropertiesSchema['~standard'],
});
export const textBlock = sValidator('json', {
  '~standard': textBlockSchema['~standard'],
});
export const imageVersion = sValidator('json', {
  '~standard': imageVersionSchema['~standard'],
});
export const blockImage = sValidator('json', {
  '~standard': blockImageSchema['~standard'],
});
export const imageBlock = sValidator('json', {
  '~standard': imageBlockSchema['~standard'],
});
export const linkBlock = sValidator('json', {
  '~standard': linkBlockSchema['~standard'],
});
export const blockAttachment = sValidator('json', {
  '~standard': blockAttachmentSchema['~standard'],
});
export const attachmentBlock = sValidator('json', {
  '~standard': attachmentBlockSchema['~standard'],
});
export const blockEmbed = sValidator('json', {
  '~standard': blockEmbedSchema['~standard'],
});
export const embedBlock = sValidator('json', {
  '~standard': embedBlockSchema['~standard'],
});
export const pendingBlock = sValidator('json', {
  '~standard': pendingBlockSchema['~standard'],
});
export const block = sValidator('json', {
  '~standard': blockSchema['~standard'],
});
export const comment = sValidator('json', {
  '~standard': commentSchema['~standard'],
});
export const channelOwner = sValidator('json', {
  '~standard': channelOwnerSchema['~standard'],
});
export const channelCounts = sValidator('json', {
  '~standard': channelCountsSchema['~standard'],
});
export const channelCollaborator = sValidator('json', {
  '~standard': channelCollaboratorSchema['~standard'],
});
export const channelAbilities = sValidator('json', {
  '~standard': channelAbilitiesSchema['~standard'],
});
export const channel = sValidator('json', {
  '~standard': channelSchema['~standard'],
});
export const paginationMeta = sValidator('json', {
  '~standard': paginationMetaSchema['~standard'],
});
export const paginatedResponse = sValidator('json', {
  '~standard': paginatedResponseSchema['~standard'],
});
export const userList = sValidator('json', {
  '~standard': userListSchema['~standard'],
});
export const channelList = sValidator('json', {
  '~standard': channelListSchema['~standard'],
});
export const connectableList = sValidator('json', {
  '~standard': connectableListSchema['~standard'],
});
export const followableList = sValidator('json', {
  '~standard': followableListSchema['~standard'],
});
export const everythingList = sValidator('json', {
  '~standard': everythingListSchema['~standard'],
});
export const userListResponse = sValidator('json', {
  '~standard': userListResponseSchema['~standard'],
});
export const channelListResponse = sValidator('json', {
  '~standard': channelListResponseSchema['~standard'],
});
export const connectableListResponse = sValidator('json', {
  '~standard': connectableListResponseSchema['~standard'],
});
export const followableListResponse = sValidator('json', {
  '~standard': followableListResponseSchema['~standard'],
});
export const everythingListResponse = sValidator('json', {
  '~standard': everythingListResponseSchema['~standard'],
});
export const commentList = sValidator('json', {
  '~standard': commentListSchema['~standard'],
});
export const commentListResponse = sValidator('json', {
  '~standard': commentListResponseSchema['~standard'],
});
export const pingResponse = sValidator('json', {
  '~standard': pingResponseSchema['~standard'],
});
export const pageParam = sValidator('query', {
  '~standard': pageParamParamSchema['~standard'],
});
export const perParam = sValidator('query', {
  '~standard': perParamParamSchema['~standard'],
});
export const idParam = sValidator('param', {
  '~standard': idParamParamSchema['~standard'],
});
export const slugOrIdParam = sValidator('param', {
  '~standard': slugOrIdParamParamSchema['~standard'],
});
export const connectionSortParam = sValidator('query', {
  '~standard': connectionSortParamParamSchema['~standard'],
});
export const contentSortParam = sValidator('query', {
  '~standard': contentSortParamParamSchema['~standard'],
});
export const channelContentSortParam = sValidator('query', {
  '~standard': channelContentSortParamParamSchema['~standard'],
});
export const contentTypeFilterParam = sValidator('query', {
  '~standard': contentTypeFilterParamParamSchema['~standard'],
});
export const createOAuthTokenRequest = sValidator('form', {
  '~standard': createOAuthTokenRequestSchema['~standard'],
});
export const createOAuthTokenResponse = sValidator('json', {
  '~standard': createOAuthTokenResponseSchema['~standard'],
});
export const getOpenapiSpecResponse = sValidator('json', {
  '~standard': getOpenapiSpecResponseSchema['~standard'],
});
export const getOpenapiSpecJsonResponse = sValidator('json', {
  '~standard': getOpenapiSpecJsonResponseSchema['~standard'],
});
export const getPingResponse = sValidator('json', {
  '~standard': getPingResponseSchema['~standard'],
});
export const presignUploadRequest = sValidator('json', {
  '~standard': presignUploadRequestSchema['~standard'],
});
export const presignUploadResponse = sValidator('json', {
  '~standard': presignUploadResponseSchema['~standard'],
});
export const createBlockRequest = sValidator('json', {
  '~standard': createBlockRequestSchema['~standard'],
});
export const createBlockResponse = sValidator('json', {
  '~standard': createBlockResponseSchema['~standard'],
});
export const batchCreateBlocksRequest = sValidator('json', {
  '~standard': batchCreateBlocksRequestSchema['~standard'],
});
export const batchCreateBlocksResponse = sValidator('json', {
  '~standard': batchCreateBlocksResponseSchema['~standard'],
});
export const getBatchStatusResponse = sValidator('json', {
  '~standard': getBatchStatusResponseSchema['~standard'],
});
export const getBlockResponse = sValidator('json', {
  '~standard': getBlockResponseSchema['~standard'],
});
export const updateBlockRequest = sValidator('json', {
  '~standard': updateBlockRequestSchema['~standard'],
});
export const updateBlockResponse = sValidator('json', {
  '~standard': updateBlockResponseSchema['~standard'],
});
export const getBlockConnectionsResponse = sValidator('json', {
  '~standard': getBlockConnectionsResponseSchema['~standard'],
});
export const getBlockCommentsResponse = sValidator('json', {
  '~standard': getBlockCommentsResponseSchema['~standard'],
});
export const createBlockCommentRequest = sValidator('json', {
  '~standard': createBlockCommentRequestSchema['~standard'],
});
export const createBlockCommentResponse = sValidator('json', {
  '~standard': createBlockCommentResponseSchema['~standard'],
});
export const createChannelRequest = sValidator('json', {
  '~standard': createChannelRequestSchema['~standard'],
});
export const createChannelResponse = sValidator('json', {
  '~standard': createChannelResponseSchema['~standard'],
});
export const getChannelResponse = sValidator('json', {
  '~standard': getChannelResponseSchema['~standard'],
});
export const updateChannelRequest = sValidator('json', {
  '~standard': updateChannelRequestSchema['~standard'],
});
export const updateChannelResponse = sValidator('json', {
  '~standard': updateChannelResponseSchema['~standard'],
});
export const createConnectionRequest = sValidator('json', {
  '~standard': createConnectionRequestSchema['~standard'],
});
export const createConnectionResponse = sValidator('json', {
  '~standard': createConnectionResponseSchema['~standard'],
});
export const getConnectionResponse = sValidator('json', {
  '~standard': getConnectionResponseSchema['~standard'],
});
export const moveConnectionRequest = sValidator('json', {
  '~standard': moveConnectionRequestSchema['~standard'],
});
export const moveConnectionResponse = sValidator('json', {
  '~standard': moveConnectionResponseSchema['~standard'],
});
export const getChannelContentsResponse = sValidator('json', {
  '~standard': getChannelContentsResponseSchema['~standard'],
});
export const getChannelConnectionsResponse = sValidator('json', {
  '~standard': getChannelConnectionsResponseSchema['~standard'],
});
export const getChannelFollowersResponse = sValidator('json', {
  '~standard': getChannelFollowersResponseSchema['~standard'],
});
export const getCurrentUserResponse = sValidator('json', {
  '~standard': getCurrentUserResponseSchema['~standard'],
});
export const getUserResponse = sValidator('json', {
  '~standard': getUserResponseSchema['~standard'],
});
export const getUserContentsResponse = sValidator('json', {
  '~standard': getUserContentsResponseSchema['~standard'],
});
export const getUserFollowersResponse = sValidator('json', {
  '~standard': getUserFollowersResponseSchema['~standard'],
});
export const getUserFollowingResponse = sValidator('json', {
  '~standard': getUserFollowingResponseSchema['~standard'],
});
export const getGroupResponse = sValidator('json', {
  '~standard': getGroupResponseSchema['~standard'],
});
export const getGroupContentsResponse = sValidator('json', {
  '~standard': getGroupContentsResponseSchema['~standard'],
});
export const getGroupFollowersResponse = sValidator('json', {
  '~standard': getGroupFollowersResponseSchema['~standard'],
});
export const searchResponse = sValidator('json', {
  '~standard': searchResponseSchema['~standard'],
});
