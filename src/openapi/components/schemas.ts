import * as v from 'valibot';

const ErrorSchema = v.required(
  v.object({
    error: v.string(),
    code: v.pipe(v.number(), v.integer()),
    details: v.object({
      message: v.string(),
    }),
  }),
  ['error', 'code'],
);
type Error = v.InferOutput<typeof ErrorSchema>;
const RateLimitErrorSchema = v.required(
  v.object({
    error: v.required(
      v.object({
        type: v.string(),
        message: v.string(),
        tier: v.picklist(['guest', 'free', 'premium', 'supporter']),
        limit: v.pipe(v.number(), v.integer()),
        limit_window: v.string(),
        retry_after: v.pipe(v.number(), v.integer()),
        current_status: v.object({
          tier: v.string(),
          limits: v.record(v.string(), v.union([v.number()])),
          upgrade_path: v.object({
            current: v.string(),
            recommended: v.string(),
            benefits: v.array(v.string()),
            action: v.string(),
          }),
        }),
        suggestions: v.array(v.string()),
        headers_note: v.string(),
      }),
      ['type', 'message', 'tier', 'limit', 'retry_after', 'suggestions'],
    ),
  }),
  ['error'],
);
type RateLimitError = v.InferOutput<typeof RateLimitErrorSchema>;
const LinksSchema = v.required(v.object({}), ['self']);
type Links = v.InferOutput<typeof LinksSchema>;
const LinkSchema = v.required(
  v.object({
    href: v.string(),
  }),
  ['href'],
);
type Link = v.InferOutput<typeof LinkSchema>;
const MarkdownContentSchema = v.required(
  v.object({
    markdown: v.string(),
    html: v.string(),
    plain: v.string(),
  }),
  ['markdown', 'html', 'plain'],
);
type MarkdownContent = v.InferOutput<typeof MarkdownContentSchema>;
const EmbeddedUserSchema = v.required(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    type: v.picklist(['User']),
    name: v.string(),
    slug: v.string(),
    avatar: v.union([v.string(), v.null(), v.undefined()]),
    initials: v.string(),
  }),
  ['id', 'type', 'name', 'slug', 'avatar', 'initials'],
);
type EmbeddedUser = v.InferOutput<typeof EmbeddedUserSchema>;
const ConnectionContextSchema = v.required(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    position: v.pipe(v.number(), v.integer()),
    pinned: v.boolean(),
    connected_at: v.string(),
  }),
  ['id', 'position', 'pinned', 'connected_at', 'connected_by'],
);
type ConnectionContext = v.InferOutput<typeof ConnectionContextSchema>;
const EmbeddedGroupSchema = v.required(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    type: v.picklist(['Group']),
    name: v.string(),
    slug: v.string(),
    avatar: v.union([v.string(), v.null(), v.undefined()]),
    initials: v.string(),
  }),
  ['id', 'type', 'name', 'slug', 'avatar', 'initials'],
);
type EmbeddedGroup = v.InferOutput<typeof EmbeddedGroupSchema>;
const UserSchema = v.intersect([
  EmbeddedUserSchema,
  v.required(
    v.object({
      created_at: v.string(),
      updated_at: v.string(),
    }),
    ['created_at', 'updated_at', 'counts', '_links'],
  ),
]);
type User = v.InferOutput<typeof UserSchema>;
const UserCountsSchema = v.required(
  v.object({
    channels: v.pipe(v.number(), v.integer()),
    followers: v.pipe(v.number(), v.integer()),
    following: v.pipe(v.number(), v.integer()),
  }),
  ['channels', 'followers', 'following'],
);
type UserCounts = v.InferOutput<typeof UserCountsSchema>;
const GroupSchema = v.intersect([
  EmbeddedGroupSchema,
  v.required(
    v.object({
      created_at: v.string(),
      updated_at: v.string(),
    }),
    ['created_at', 'updated_at', 'user', 'counts', '_links'],
  ),
]);
type Group = v.InferOutput<typeof GroupSchema>;
const GroupCountsSchema = v.required(
  v.object({
    channels: v.pipe(v.number(), v.integer()),
    users: v.pipe(v.number(), v.integer()),
  }),
  ['channels', 'users'],
);
type GroupCounts = v.InferOutput<typeof GroupCountsSchema>;
const ContentTypeFilterSchema = v.picklist([
  'Text',
  'Image',
  'Link',
  'Attachment',
  'Embed',
  'Channel',
  'Block',
]);
type ContentTypeFilter = v.InferOutput<typeof ContentTypeFilterSchema>;
const SearchTypeFilterSchema = v.picklist([
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
type SearchTypeFilter = v.InferOutput<typeof SearchTypeFilterSchema>;
const FileExtensionSchema = v.picklist([
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
type FileExtension = v.InferOutput<typeof FileExtensionSchema>;
const ConnectionSortSchema = v.picklist(['created_at_desc', 'created_at_asc']);
type ConnectionSort = v.InferOutput<typeof ConnectionSortSchema>;
const ChannelContentSortSchema = v.picklist([
  'position_asc',
  'position_desc',
  'created_at_asc',
  'created_at_desc',
  'updated_at_asc',
  'updated_at_desc',
]);
type ChannelContentSort = v.InferOutput<typeof ChannelContentSortSchema>;
const ContentSortSchema = v.picklist([
  'created_at_asc',
  'created_at_desc',
  'updated_at_asc',
  'updated_at_desc',
]);
type ContentSort = v.InferOutput<typeof ContentSortSchema>;
const BaseBlockPropertiesSchema = v.required(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    base_type: v.picklist(['Block']),
    title: v.union([v.string(), v.null(), v.undefined()]),
    state: v.picklist(['available', 'pending', 'failed', 'processing']),
    visibility: v.picklist(['public', 'private', 'orphan']),
    comment_count: v.pipe(v.number(), v.integer()),
    created_at: v.string(),
    updated_at: v.string(),
  }),
  [
    'id',
    'base_type',
    'state',
    'visibility',
    'comment_count',
    'created_at',
    'updated_at',
    'user',
    '_links',
  ],
);
type BaseBlockProperties = v.InferOutput<typeof BaseBlockPropertiesSchema>;
const TextBlockSchema = v.intersect([
  BaseBlockPropertiesSchema,
  v.required(
    v.object({
      type: v.picklist(['Text']),
    }),
    ['type', 'content'],
  ),
]);
type TextBlock = v.InferOutput<typeof TextBlockSchema>;
const ImageBlockSchema = v.intersect([
  BaseBlockPropertiesSchema,
  v.required(
    v.object({
      type: v.picklist(['Image']),
    }),
    ['type', 'image'],
  ),
]);
type ImageBlock = v.InferOutput<typeof ImageBlockSchema>;
const LinkBlockSchema = v.intersect([
  BaseBlockPropertiesSchema,
  v.required(
    v.object({
      type: v.picklist(['Link']),
    }),
    ['type'],
  ),
]);
type LinkBlock = v.InferOutput<typeof LinkBlockSchema>;
const AttachmentBlockSchema = v.intersect([
  BaseBlockPropertiesSchema,
  v.required(
    v.object({
      type: v.picklist(['Attachment']),
    }),
    ['type', 'attachment'],
  ),
]);
type AttachmentBlock = v.InferOutput<typeof AttachmentBlockSchema>;
const EmbedBlockSchema = v.intersect([
  BaseBlockPropertiesSchema,
  v.required(
    v.object({
      type: v.picklist(['Embed']),
    }),
    ['type', 'embed'],
  ),
]);
type EmbedBlock = v.InferOutput<typeof EmbedBlockSchema>;
const BlockSchema = v.union([
  TextBlockSchema,
  ImageBlockSchema,
  LinkBlockSchema,
  AttachmentBlockSchema,
  EmbedBlockSchema,
]);
type Block = v.InferOutput<typeof BlockSchema>;
const BlockSourceSchema = v.required(
  v.object({
    url: v.string(),
    title: v.union([v.string(), v.null(), v.undefined()]),
  }),
  ['url'],
);
type BlockSource = v.InferOutput<typeof BlockSourceSchema>;
const BlockProviderSchema = v.required(
  v.object({
    name: v.string(),
    url: v.string(),
  }),
  ['name', 'url'],
);
type BlockProvider = v.InferOutput<typeof BlockProviderSchema>;
const BlockImageSchema = v.required(
  v.object({
    alt_text: v.union([v.string(), v.null(), v.undefined()]),
    blurhash: v.union([v.string(), v.null(), v.undefined()]),
    width: v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
    height: v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
    aspect_ratio: v.union([v.number(), v.null(), v.undefined()]),
    content_type: v.string(),
    filename: v.string(),
    file_size: v.union([
      v.pipe(v.number(), v.integer()),
      v.null(),
      v.undefined(),
    ]),
    updated_at: v.string(),
  }),
  ['small', 'medium', 'large', 'square'],
);
type BlockImage = v.InferOutput<typeof BlockImageSchema>;
const ImageVersionSchema = v.required(
  v.object({
    src: v.string(),
    src_1x: v.string(),
    src_2x: v.string(),
    width: v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
    height: v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
  }),
  ['src', 'src_1x', 'src_2x'],
);
type ImageVersion = v.InferOutput<typeof ImageVersionSchema>;
const BlockEmbedSchema = v.object({
  url: v.union([v.string(), v.null(), v.undefined()]),
  type: v.union([v.string(), v.null(), v.undefined()]),
  title: v.union([v.string(), v.null(), v.undefined()]),
  author_name: v.union([v.string(), v.null(), v.undefined()]),
  author_url: v.union([v.string(), v.null(), v.undefined()]),
  source_url: v.union([v.string(), v.null(), v.undefined()]),
  width: v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
  height: v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
  html: v.union([v.string(), v.null(), v.undefined()]),
  thumbnail_url: v.union([v.string(), v.null(), v.undefined()]),
});
type BlockEmbed = v.InferOutput<typeof BlockEmbedSchema>;
const BlockAttachmentSchema = v.required(
  v.object({
    filename: v.union([v.string(), v.null(), v.undefined()]),
    content_type: v.union([v.string(), v.null(), v.undefined()]),
    file_size: v.union([
      v.pipe(v.number(), v.integer()),
      v.null(),
      v.undefined(),
    ]),
    file_extension: v.union([v.string(), v.null(), v.undefined()]),
    updated_at: v.union([v.string(), v.null(), v.undefined()]),
    url: v.string(),
  }),
  ['url'],
);
type BlockAttachment = v.InferOutput<typeof BlockAttachmentSchema>;
const CommentSchema = v.required(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    type: v.picklist(['Comment']),
    created_at: v.string(),
    updated_at: v.string(),
  }),
  ['id', 'type', 'created_at', 'updated_at', 'user', '_links'],
);
type Comment = v.InferOutput<typeof CommentSchema>;
const ChannelOwnerSchema = v.union([EmbeddedUserSchema, EmbeddedGroupSchema]);
type ChannelOwner = v.InferOutput<typeof ChannelOwnerSchema>;
const ChannelCountsSchema = v.required(
  v.object({
    blocks: v.pipe(v.number(), v.integer()),
    channels: v.pipe(v.number(), v.integer()),
    contents: v.pipe(v.number(), v.integer()),
    collaborators: v.pipe(v.number(), v.integer()),
  }),
  ['blocks', 'channels', 'contents', 'collaborators'],
);
type ChannelCounts = v.InferOutput<typeof ChannelCountsSchema>;
const ChannelSchema = v.required(
  v.object({
    id: v.pipe(v.number(), v.integer()),
    type: v.picklist(['Channel']),
    slug: v.string(),
    title: v.string(),
    state: v.picklist(['available', 'deleted']),
    visibility: v.picklist(['public', 'private', 'closed']),
    created_at: v.string(),
    updated_at: v.string(),
  }),
  [
    'id',
    'type',
    'slug',
    'title',
    'state',
    'visibility',
    'created_at',
    'updated_at',
    'owner',
    'counts',
    '_links',
  ],
);
type Channel = v.InferOutput<typeof ChannelSchema>;
const PaginationMetaWithCountSchema = v.required(
  v.object({
    current_page: v.pipe(v.number(), v.integer()),
    next_page: v.union([
      v.pipe(v.number(), v.integer()),
      v.null(),
      v.undefined(),
    ]),
    prev_page: v.union([
      v.pipe(v.number(), v.integer()),
      v.null(),
      v.undefined(),
    ]),
    per_page: v.pipe(v.number(), v.integer()),
    total_pages: v.pipe(v.number(), v.integer()),
    total_count: v.pipe(v.number(), v.integer()),
    has_more_pages: v.boolean(),
  }),
  ['current_page', 'per_page', 'total_pages', 'total_count', 'has_more_pages'],
);
type PaginationMetaWithCount = v.InferOutput<
  typeof PaginationMetaWithCountSchema
>;
const PaginationMetaWithoutCountSchema = v.required(
  v.object({
    current_page: v.pipe(v.number(), v.integer()),
    next_page: v.union([
      v.pipe(v.number(), v.integer()),
      v.null(),
      v.undefined(),
    ]),
    prev_page: v.union([
      v.pipe(v.number(), v.integer()),
      v.null(),
      v.undefined(),
    ]),
    per_page: v.pipe(v.number(), v.integer()),
    has_more_pages: v.boolean(),
  }),
  ['current_page', 'per_page', 'has_more_pages'],
);
type PaginationMetaWithoutCount = v.InferOutput<
  typeof PaginationMetaWithoutCountSchema
>;
const PaginationMetaSchema = v.union([
  PaginationMetaWithCountSchema,
  PaginationMetaWithoutCountSchema,
]);
type PaginationMeta = v.InferOutput<typeof PaginationMetaSchema>;
const PaginatedResponseBaseSchema = v.required(v.object({}), ['data', 'meta']);
type PaginatedResponseBase = v.InferOutput<typeof PaginatedResponseBaseSchema>;
const PaginatedResponseWithCountBaseSchema = v.required(v.object({}), [
  'data',
  'meta',
]);
type PaginatedResponseWithCountBase = v.InferOutput<
  typeof PaginatedResponseWithCountBaseSchema
>;
const UserListSchema = v.required(
  v.object({
    data: v.array(UserSchema),
  }),
  ['data'],
);
type UserList = v.InferOutput<typeof UserListSchema>;
const ChannelListSchema = v.required(
  v.object({
    data: v.array(ChannelSchema),
  }),
  ['data'],
);
type ChannelList = v.InferOutput<typeof ChannelListSchema>;
const ConnectableListSchema = v.required(
  v.object({
    data: v.array(
      v.union([
        TextBlockSchema,
        ImageBlockSchema,
        LinkBlockSchema,
        AttachmentBlockSchema,
        EmbedBlockSchema,
        ChannelSchema,
      ]),
    ),
  }),
  ['data'],
);
type ConnectableList = v.InferOutput<typeof ConnectableListSchema>;
const FollowableListSchema = v.required(
  v.object({
    data: v.array(v.union([UserSchema, ChannelSchema, GroupSchema])),
  }),
  ['data'],
);
type FollowableList = v.InferOutput<typeof FollowableListSchema>;
const EverythingListSchema = v.required(
  v.object({
    data: v.array(
      v.union([
        TextBlockSchema,
        ImageBlockSchema,
        LinkBlockSchema,
        AttachmentBlockSchema,
        EmbedBlockSchema,
        ChannelSchema,
        UserSchema,
        GroupSchema,
      ]),
    ),
  }),
  ['data'],
);
type EverythingList = v.InferOutput<typeof EverythingListSchema>;
const UserListResponseSchema = v.intersect([
  UserListSchema,
  PaginatedResponseWithCountBaseSchema,
]);
type UserListResponse = v.InferOutput<typeof UserListResponseSchema>;
const ChannelListResponseSchema = v.intersect([
  ChannelListSchema,
  PaginatedResponseWithCountBaseSchema,
]);
type ChannelListResponse = v.InferOutput<typeof ChannelListResponseSchema>;
const ConnectableListResponseSchema = v.intersect([
  ConnectableListSchema,
  PaginatedResponseBaseSchema,
]);
type ConnectableListResponse = v.InferOutput<
  typeof ConnectableListResponseSchema
>;
const FollowableListResponseSchema = v.intersect([
  FollowableListSchema,
  PaginatedResponseWithCountBaseSchema,
]);
type FollowableListResponse = v.InferOutput<
  typeof FollowableListResponseSchema
>;
const EverythingListResponseSchema = v.intersect([
  EverythingListSchema,
  PaginatedResponseWithCountBaseSchema,
]);
type EverythingListResponse = v.InferOutput<
  typeof EverythingListResponseSchema
>;
const CommentListSchema = v.required(
  v.object({
    data: v.array(CommentSchema),
  }),
  ['data'],
);
type CommentList = v.InferOutput<typeof CommentListSchema>;
const CommentListResponseSchema = v.intersect([
  CommentListSchema,
  PaginatedResponseWithCountBaseSchema,
]);
type CommentListResponse = v.InferOutput<typeof CommentListResponseSchema>;
const PingResponseSchema = v.required(
  v.object({
    status: v.picklist(['ok']),
  }),
  ['status'],
);
type PingResponse = v.InferOutput<typeof PingResponseSchema>;

export {
  ErrorSchema,
  type Error,
  RateLimitErrorSchema,
  type RateLimitError,
  LinksSchema,
  type Links,
  LinkSchema,
  type Link,
  MarkdownContentSchema,
  type MarkdownContent,
  EmbeddedUserSchema,
  type EmbeddedUser,
  ConnectionContextSchema,
  type ConnectionContext,
  EmbeddedGroupSchema,
  type EmbeddedGroup,
  UserSchema,
  type User,
  UserCountsSchema,
  type UserCounts,
  GroupSchema,
  type Group,
  GroupCountsSchema,
  type GroupCounts,
  ContentTypeFilterSchema,
  type ContentTypeFilter,
  SearchTypeFilterSchema,
  type SearchTypeFilter,
  FileExtensionSchema,
  type FileExtension,
  ConnectionSortSchema,
  type ConnectionSort,
  ChannelContentSortSchema,
  type ChannelContentSort,
  ContentSortSchema,
  type ContentSort,
  BaseBlockPropertiesSchema,
  type BaseBlockProperties,
  TextBlockSchema,
  type TextBlock,
  ImageBlockSchema,
  type ImageBlock,
  LinkBlockSchema,
  type LinkBlock,
  AttachmentBlockSchema,
  type AttachmentBlock,
  EmbedBlockSchema,
  type EmbedBlock,
  BlockSchema,
  type Block,
  BlockSourceSchema,
  type BlockSource,
  BlockProviderSchema,
  type BlockProvider,
  BlockImageSchema,
  type BlockImage,
  ImageVersionSchema,
  type ImageVersion,
  BlockEmbedSchema,
  type BlockEmbed,
  BlockAttachmentSchema,
  type BlockAttachment,
  CommentSchema,
  type Comment,
  ChannelOwnerSchema,
  type ChannelOwner,
  ChannelCountsSchema,
  type ChannelCounts,
  ChannelSchema,
  type Channel,
  PaginationMetaWithCountSchema,
  type PaginationMetaWithCount,
  PaginationMetaWithoutCountSchema,
  type PaginationMetaWithoutCount,
  PaginationMetaSchema,
  type PaginationMeta,
  PaginatedResponseBaseSchema,
  type PaginatedResponseBase,
  PaginatedResponseWithCountBaseSchema,
  type PaginatedResponseWithCountBase,
  UserListSchema,
  type UserList,
  ChannelListSchema,
  type ChannelList,
  ConnectableListSchema,
  type ConnectableList,
  FollowableListSchema,
  type FollowableList,
  EverythingListSchema,
  type EverythingList,
  UserListResponseSchema,
  type UserListResponse,
  ChannelListResponseSchema,
  type ChannelListResponse,
  ConnectableListResponseSchema,
  type ConnectableListResponse,
  FollowableListResponseSchema,
  type FollowableListResponse,
  EverythingListResponseSchema,
  type EverythingListResponse,
  CommentListSchema,
  type CommentList,
  CommentListResponseSchema,
  type CommentListResponse,
  PingResponseSchema,
  type PingResponse,
};
