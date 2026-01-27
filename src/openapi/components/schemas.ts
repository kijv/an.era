import * as v from 'valibot';

const ErrorSchema = v.required(
  v.partial(
    v.object({
      error: v.pipe(
        v.string(),
        v.metadata({
          description: 'Error message',
        }),
        v.examples(['Not Found']),
      ),
      code: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'HTTP status code',
        }),
        v.examples([404]),
      ),
      details: v.pipe(
        v.object({
          message: v.pipe(
            v.string(),
            v.metadata({
              description: 'Detailed error message',
            }),
            v.examples(['The resource you are looking for does not exist.']),
          ),
        }),
        v.metadata({
          description: 'Additional error details',
        }),
      ),
    }),
  ),
  ['error', 'code'],
);
type Error = v.InferInput<typeof ErrorSchema>;
const RateLimitErrorSchema = v.pipe(
  v.required(
    v.object({
      error: v.required(
        v.partial(
          v.object({
            type: v.pipe(
              v.string(),
              v.metadata({
                description: 'Error type identifier',
              }),
              v.examples(['rate_limit_exceeded']),
            ),
            message: v.pipe(
              v.string(),
              v.metadata({
                description: 'Human-readable error message',
              }),
              v.examples([
                'Rate limit of 30 requests per minute exceeded for guest tier. Try again later.',
              ]),
            ),
            tier: v.pipe(
              v.picklist(['guest', 'free', 'premium', 'supporter']),
              v.metadata({
                description: "User's current tier",
              }),
              v.examples(['guest']),
            ),
            limit: v.pipe(
              v.pipe(v.number(), v.integer()),
              v.metadata({
                description: 'Request limit per minute for this tier',
              }),
              v.examples([30]),
            ),
            limit_window: v.pipe(
              v.string(),
              v.metadata({
                description: 'Time window for rate limits',
              }),
              v.examples(['1 minute']),
            ),
            retry_after: v.pipe(
              v.pipe(v.number(), v.integer()),
              v.metadata({
                description: 'Suggested seconds to wait before retrying',
              }),
              v.examples([65]),
            ),
            current_status: v.object({
              tier: v.pipe(v.string(), v.examples(['guest'])),
              limits: v.pipe(
                v.record(v.string(), v.union([v.number()])),
                v.examples([
                  { guest: 30, free: 120, premium: 300, supporter: 600 },
                ]),
              ),
              upgrade_path: v.object({
                current: v.pipe(v.string(), v.examples(['Guest (30 req/min)'])),
                recommended: v.pipe(
                  v.string(),
                  v.examples(['Free Account (120 req/min)']),
                ),
                benefits: v.pipe(
                  v.array(v.string()),
                  v.examples([
                    [
                      '4x higher rate limit',
                      'Persistent authentication',
                      'API access',
                    ],
                  ]),
                ),
                action: v.pipe(
                  v.string(),
                  v.examples(['Sign up at https://are.na/signup']),
                ),
              }),
            }),
            suggestions: v.pipe(
              v.array(v.string()),
              v.metadata({
                description: 'Tier-specific optimization suggestions',
              }),
              v.examples([
                [
                  'Sign up for a free account to get 120 requests per minute',
                  'Implement exponential backoff with jitter',
                  'Cache responses when possible to reduce API calls',
                  'Consider batch requests if available',
                ],
              ]),
            ),
            headers_note: v.pipe(
              v.string(),
              v.metadata({
                description: 'Information about header usage',
              }),
              v.examples([
                "Check 'X-RateLimit-*' headers on successful requests for current usage",
              ]),
            ),
          }),
        ),
        ['type', 'message', 'tier', 'limit', 'retry_after', 'suggestions'],
      ),
    }),
    ['error'],
  ),
  v.metadata({
    description:
      'Rate limit exceeded error response with upgrade information and suggestions',
  }),
);
type RateLimitError = v.InferInput<typeof RateLimitErrorSchema>;
const LinkSchema = v.pipe(
  v.required(
    v.object({
      href: v.pipe(
        v.string(),
        v.metadata({
          description: 'The URL of the linked resource',
        }),
        v.examples(['https://api.are.na/v3/blocks/12345']),
      ),
    }),
    ['href'],
  ),
  v.metadata({
    description:
      'A hypermedia link containing the URL of a linked resource.\nThe relationship type is expressed by the key in the parent _links object.\n',
  }),
);
type Link = v.InferInput<typeof LinkSchema>;
const MarkdownContentSchema = v.pipe(
  v.required(
    v.object({
      markdown: v.pipe(
        v.string(),
        v.metadata({
          description: 'Original markdown value',
        }),
        v.examples(['This is **only** a [test](https://example.com).']),
      ),
      html: v.pipe(
        v.string(),
        v.metadata({
          description: 'HTML rendering of the markdown',
        }),
        v.examples([
          '<p>This is <strong>only</strong> a <a href="https://example.com" target="_blank" rel="nofollow noopener">test</a>.</p>',
        ]),
      ),
      plain: v.pipe(
        v.string(),
        v.metadata({
          description: 'Plain text rendering of the markdown',
        }),
        v.examples(['This is only a test (https://example.com).']),
      ),
    }),
    ['markdown', 'html', 'plain'],
  ),
  v.metadata({
    description: 'Markdown content with multiple renderings',
  }),
);
type MarkdownContent = v.InferInput<typeof MarkdownContentSchema>;
const EmbeddedUserSchema = v.pipe(
  v.required(
    v.object({
      id: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Unique identifier for the user',
        }),
        v.examples([12345]),
      ),
      type: v.pipe(
        v.picklist(['User']),
        v.metadata({
          description: 'User type',
        }),
        v.examples(['User']),
      ),
      name: v.pipe(
        v.string(),
        v.metadata({
          description: "User's display name",
        }),
        v.examples(['John Doe']),
      ),
      slug: v.pipe(
        v.string(),
        v.metadata({
          description: 'URL-safe identifier (use this in API paths)',
        }),
        v.examples(['john-doe']),
      ),
      avatar: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: "URL to user's avatar image",
        }),
        v.examples(['https://d2w9rnfcy7mm78.cloudfront.net/12345/avatar.jpg']),
      ),
      initials: v.pipe(
        v.string(),
        v.metadata({
          description: "User's initials",
        }),
        v.examples(['JD']),
      ),
    }),
    ['id', 'type', 'name', 'slug', 'avatar', 'initials'],
  ),
  v.metadata({
    description:
      'Embedded user representation (used when user is nested in other resources)',
  }),
);
type EmbeddedUser = v.InferInput<typeof EmbeddedUserSchema>;
const EmbeddedGroupSchema = v.pipe(
  v.required(
    v.object({
      id: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Unique identifier for the group',
        }),
        v.examples([67890]),
      ),
      type: v.pipe(
        v.picklist(['Group']),
        v.metadata({
          description: 'Group type',
        }),
        v.examples(['Group']),
      ),
      name: v.pipe(
        v.string(),
        v.metadata({
          description: "Group's name",
        }),
        v.examples(['Design Team']),
      ),
      slug: v.pipe(
        v.string(),
        v.metadata({
          description: "Group's URL slug",
        }),
        v.examples(['design-team-abc123']),
      ),
      avatar: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: "URL to group's avatar image",
        }),
        v.examples([
          'https://d2w9rnfcy7mm78.cloudfront.net/groups/67890/avatar.jpg',
        ]),
      ),
      initials: v.pipe(
        v.string(),
        v.metadata({
          description: "Group's initials",
        }),
        v.examples(['DT']),
      ),
    }),
    ['id', 'type', 'name', 'slug', 'avatar', 'initials'],
  ),
  v.metadata({
    description:
      'Embedded group representation (used when group is nested in other resources)',
  }),
);
type EmbeddedGroup = v.InferInput<typeof EmbeddedGroupSchema>;
const UserCountsSchema = v.pipe(
  v.required(
    v.object({
      channels: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of channels owned by the user',
        }),
        v.examples([24]),
      ),
      followers: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of followers',
        }),
        v.examples([156]),
      ),
      following: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of users being followed',
        }),
        v.examples([89]),
      ),
    }),
    ['channels', 'followers', 'following'],
  ),
  v.metadata({
    description: 'Counts of various items for the user',
  }),
);
type UserCounts = v.InferInput<typeof UserCountsSchema>;
const GroupCountsSchema = v.pipe(
  v.required(
    v.object({
      channels: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of channels owned by the group',
        }),
        v.examples([12]),
      ),
      users: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of users in the group',
        }),
        v.examples([5]),
      ),
    }),
    ['channels', 'users'],
  ),
  v.metadata({
    description: 'Counts of various items for the group',
  }),
);
type GroupCounts = v.InferInput<typeof GroupCountsSchema>;
const ContentTypeFilterSchema = v.pipe(
  v.picklist([
    'Text',
    'Image',
    'Link',
    'Attachment',
    'Embed',
    'Channel',
    'Block',
  ]),
  v.metadata({
    description: 'Filter for content types (blocks and channels)',
  }),
);
type ContentTypeFilter = v.InferInput<typeof ContentTypeFilterSchema>;
const SearchTypeFilterSchema = v.pipe(
  v.picklist([
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
  ]),
  v.metadata({
    description:
      'Filter for searchable content types (includes all content types plus users and groups)',
  }),
);
type SearchTypeFilter = v.InferInput<typeof SearchTypeFilterSchema>;
const FileExtensionSchema = v.pipe(
  v.picklist([
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
  ]),
  v.metadata({
    description: 'Supported file extensions for filtering',
  }),
);
type FileExtension = v.InferInput<typeof FileExtensionSchema>;
const ConnectionSortSchema = v.pipe(
  v.picklist(['created_at_desc', 'created_at_asc']),
  v.metadata({
    description:
      'Sort order for connection lists (channels containing a block/channel, followers)',
  }),
);
type ConnectionSort = v.InferInput<typeof ConnectionSortSchema>;
const ChannelContentSortSchema = v.pipe(
  v.picklist([
    'position_asc',
    'position_desc',
    'created_at_asc',
    'created_at_desc',
    'updated_at_asc',
    'updated_at_desc',
  ]),
  v.metadata({
    description:
      'Sort order for channel contents (includes position for manual ordering)',
  }),
);
type ChannelContentSort = v.InferInput<typeof ChannelContentSortSchema>;
const ContentSortSchema = v.pipe(
  v.picklist([
    'created_at_asc',
    'created_at_desc',
    'updated_at_asc',
    'updated_at_desc',
  ]),
  v.metadata({
    description: 'Sort order for user/group content lists',
  }),
);
type ContentSort = v.InferInput<typeof ContentSortSchema>;
const BlockProviderSchema = v.required(
  v.object({
    name: v.pipe(
      v.string(),
      v.metadata({
        description: 'Provider name (from parsed URI host)',
      }),
      v.examples(['Example.com']),
    ),
    url: v.pipe(
      v.string(),
      v.metadata({
        description: 'Provider URL (from parsed URI scheme and host)',
      }),
      v.examples(['https://example.com']),
    ),
  }),
  ['name', 'url'],
);
type BlockProvider = v.InferInput<typeof BlockProviderSchema>;
const ImageVersionSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        src: v.pipe(
          v.string(),
          v.metadata({
            description: 'Default image URL (1x resolution)',
          }),
          v.examples([
            'https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image.jpg',
          ]),
        ),
        src_1x: v.pipe(
          v.string(),
          v.metadata({
            description: '1x resolution image URL',
          }),
          v.examples([
            'https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image.jpg',
          ]),
        ),
        src_2x: v.pipe(
          v.string(),
          v.metadata({
            description: '2x resolution image URL for high DPI displays',
          }),
          v.examples([
            'https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image@2x.jpg',
          ]),
        ),
        width: v.pipe(
          v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
          v.metadata({
            description: 'Width of the resized image in pixels',
          }),
          v.examples([640]),
        ),
        height: v.pipe(
          v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
          v.metadata({
            description: 'Height of the resized image in pixels',
          }),
          v.examples([480]),
        ),
      }),
    ),
    ['src', 'src_1x', 'src_2x'],
  ),
  v.metadata({
    description:
      'A resized/processed version of an image with multiple resolution URLs',
  }),
);
type ImageVersion = v.InferInput<typeof ImageVersionSchema>;
const BlockEmbedSchema = v.object({
  url: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed URL',
    }),
    v.examples(['https://www.youtube.com/embed/abc123']),
  ),
  type: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed type',
    }),
    v.examples(['youtube']),
  ),
  title: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed title',
    }),
    v.examples(['Video Title']),
  ),
  author_name: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Author name',
    }),
    v.examples(['Author Name']),
  ),
  author_url: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Author URL',
    }),
    v.examples(['https://example.com/author']),
  ),
  source_url: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed source URL',
    }),
    v.examples(['https://www.youtube.com/watch?v=abc123']),
  ),
  width: v.pipe(
    v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed width',
    }),
    v.examples([640]),
  ),
  height: v.pipe(
    v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed height',
    }),
    v.examples([480]),
  ),
  html: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Embed HTML',
    }),
    v.examples(["<iframe src='...'></iframe>"]),
  ),
  thumbnail_url: v.pipe(
    v.union([v.string(), v.null(), v.undefined()]),
    v.metadata({
      description: 'Thumbnail URL',
    }),
    v.examples(['https://example.com/thumbnail.jpg']),
  ),
});
type BlockEmbed = v.InferInput<typeof BlockEmbedSchema>;
const BlockAttachmentSchema = v.required(
  v.partial(
    v.object({
      filename: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: 'Attachment filename',
        }),
        v.examples(['document.pdf']),
      ),
      content_type: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: 'Attachment content type',
        }),
        v.examples(['application/pdf']),
      ),
      file_size: v.pipe(
        v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
        v.metadata({
          description: 'File size in bytes',
        }),
        v.examples([2048000]),
      ),
      file_extension: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: 'File extension',
        }),
        v.examples(['pdf']),
      ),
      updated_at: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: 'When the attachment was last updated',
        }),
      ),
      url: v.pipe(
        v.string(),
        v.metadata({
          description: 'Attachment download URL',
        }),
        v.examples(['https://attachments.are.na/12345/document.pdf']),
      ),
    }),
  ),
  ['url'],
);
type BlockAttachment = v.InferInput<typeof BlockAttachmentSchema>;
const ChannelCountsSchema = v.pipe(
  v.required(
    v.object({
      blocks: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of blocks in the channel',
        }),
        v.examples([42]),
      ),
      channels: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of channels connected to this channel',
        }),
        v.examples([8]),
      ),
      contents: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Total number of contents (blocks + channels)',
        }),
        v.examples([50]),
      ),
      collaborators: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Number of collaborators on the channel',
        }),
        v.examples([3]),
      ),
    }),
    ['blocks', 'channels', 'contents', 'collaborators'],
  ),
  v.metadata({
    description: 'Counts of various items in the channel',
  }),
);
type ChannelCounts = v.InferInput<typeof ChannelCountsSchema>;
const PaginationMetaWithCountSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        current_page: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Current page number',
          }),
          v.examples([1]),
        ),
        next_page: v.pipe(
          v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
          v.metadata({
            description: 'Next page number (null if last page)',
          }),
          v.examples([2]),
        ),
        prev_page: v.pipe(
          v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
          v.metadata({
            description: 'Previous page number (null if first page)',
          }),
        ),
        per_page: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Number of items per page',
          }),
          v.examples([25]),
        ),
        total_pages: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Total number of pages available',
          }),
          v.examples([5]),
        ),
        total_count: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Total number of items available',
          }),
          v.examples([120]),
        ),
        has_more_pages: v.pipe(
          v.boolean(),
          v.metadata({
            description: 'Whether there are more pages available',
          }),
          v.examples([true]),
        ),
      }),
    ),
    [
      'current_page',
      'per_page',
      'total_pages',
      'total_count',
      'has_more_pages',
    ],
  ),
  v.metadata({
    description: 'Pagination metadata when total counts are available',
  }),
);
type PaginationMetaWithCount = v.InferInput<
  typeof PaginationMetaWithCountSchema
>;
const PaginationMetaWithoutCountSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        current_page: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Current page number',
          }),
          v.examples([1]),
        ),
        next_page: v.pipe(
          v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
          v.metadata({
            description: 'Next page number (null if last page)',
          }),
          v.examples([2]),
        ),
        prev_page: v.pipe(
          v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
          v.metadata({
            description: 'Previous page number (null if first page)',
          }),
        ),
        per_page: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Number of items per page',
          }),
          v.examples([25]),
        ),
        has_more_pages: v.pipe(
          v.boolean(),
          v.metadata({
            description: 'Whether there are more pages available',
          }),
          v.examples([true]),
        ),
      }),
    ),
    ['current_page', 'per_page', 'has_more_pages'],
  ),
  v.metadata({
    description: 'Pagination metadata when total counts are not available',
  }),
);
type PaginationMetaWithoutCount = v.InferInput<
  typeof PaginationMetaWithoutCountSchema
>;
const PingResponseSchema = v.pipe(
  v.required(
    v.object({
      status: v.pipe(v.picklist(['ok']), v.examples(['ok'])),
    }),
    ['status'],
  ),
  v.metadata({
    description: 'Health check response',
  }),
);
type PingResponse = v.InferInput<typeof PingResponseSchema>;
const LinksSchema = v.pipe(
  v.required(
    v.object({
      self: v.intersect([
        LinkSchema,
        v.pipe(
          v.any(),
          v.metadata({
            description: 'Link to the current resource (always present)',
          }),
        ),
      ]),
    }),
    ['self'],
  ),
  v.metadata({
    description:
      'HATEOAS links for navigation and discovery.\nFollows HAL (Hypertext Application Language) format where link relationships \nare expressed as object keys (e.g., "self", "user", "channels").\n',
  }),
);
type Links = v.InferInput<typeof LinksSchema>;
const ConnectionContextSchema = v.pipe(
  v.required(
    v.object({
      id: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Unique identifier for the connection',
        }),
        v.examples([98765]),
      ),
      position: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description:
            'Position of the item within the channel (for manual ordering)',
        }),
        v.examples([1]),
      ),
      pinned: v.pipe(
        v.boolean(),
        v.metadata({
          description: 'Whether the item is pinned to the top of the channel',
        }),
        v.examples([]),
      ),
      connected_at: v.pipe(
        v.string(),
        v.metadata({
          description: 'When the item was connected to the channel',
        }),
        v.examples(['2023-01-15T10:30:00Z']),
      ),
      connected_by: v.pipe(
        v.union([EmbeddedUserSchema, v.null(), v.undefined()]),
        v.metadata({
          description: 'User who connected this item to the channel',
        }),
      ),
    }),
    ['id', 'position', 'pinned', 'connected_at', 'connected_by'],
  ),
  v.metadata({
    description:
      "Connection metadata that describes how an item is connected to a channel.\nThis is only present when the item is returned as part of a channel's contents.\n",
  }),
);
type ConnectionContext = v.InferInput<typeof ConnectionContextSchema>;
const ChannelOwnerSchema = v.pipe(
  v.union([EmbeddedUserSchema, EmbeddedGroupSchema]),
  v.metadata({
    description: 'Channel owner (User or Group)',
  }),
);
type ChannelOwner = v.InferInput<typeof ChannelOwnerSchema>;
const BlockSourceSchema = v.required(
  v.partial(
    v.object({
      url: v.pipe(
        v.string(),
        v.metadata({
          description: 'Source URL',
        }),
        v.examples(['https://example.com/article']),
      ),
      title: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: 'Source title',
        }),
        v.examples(['Original Article Title']),
      ),
      provider: v.union([BlockProviderSchema, v.null(), v.undefined()]),
    }),
  ),
  ['url'],
);
type BlockSource = v.InferInput<typeof BlockSourceSchema>;
const BlockImageSchema = v.required(
  v.partial(
    v.object({
      alt_text: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description: 'Alternative text associated with the image',
        }),
        v.examples(['Scanned collage of magazine cutouts']),
      ),
      blurhash: v.pipe(
        v.union([v.string(), v.null(), v.undefined()]),
        v.metadata({
          description:
            'BlurHash representation of the image for progressive loading',
        }),
        v.examples(['LEHV6nWB2yk8pyo0adR*.7kCMdnj']),
      ),
      width: v.pipe(
        v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
        v.metadata({
          description: 'Original image width in pixels',
        }),
        v.examples([1920]),
      ),
      height: v.pipe(
        v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
        v.metadata({
          description: 'Original image height in pixels',
        }),
        v.examples([1080]),
      ),
      aspect_ratio: v.pipe(
        v.union([v.number(), v.null(), v.undefined()]),
        v.metadata({
          description: 'Image aspect ratio (width / height)',
        }),
        v.examples([1.7778]),
      ),
      content_type: v.pipe(
        v.string(),
        v.metadata({
          description: 'Image content type',
        }),
        v.examples(['image/jpeg']),
      ),
      filename: v.pipe(
        v.string(),
        v.metadata({
          description: 'Image filename',
        }),
        v.examples(['image.jpg']),
      ),
      file_size: v.pipe(
        v.union([v.pipe(v.number(), v.integer()), v.null(), v.undefined()]),
        v.metadata({
          description: 'File size in bytes',
        }),
        v.examples([1024000]),
      ),
      updated_at: v.pipe(
        v.string(),
        v.metadata({
          description: 'When the image was last updated',
        }),
        v.examples(['2023-01-15T14:45:00Z']),
      ),
      small: v.intersect([
        ImageVersionSchema,
        v.pipe(
          v.any(),
          v.metadata({
            description: 'Small image version (thumb)',
          }),
        ),
      ]),
      medium: v.intersect([
        ImageVersionSchema,
        v.pipe(
          v.any(),
          v.metadata({
            description: 'Medium image version (display)',
          }),
        ),
      ]),
      large: v.intersect([
        ImageVersionSchema,
        v.pipe(
          v.any(),
          v.metadata({
            description: 'Large image version',
          }),
        ),
      ]),
      square: v.intersect([
        ImageVersionSchema,
        v.pipe(
          v.any(),
          v.metadata({
            description: 'Square cropped image version',
          }),
        ),
      ]),
    }),
  ),
  ['small', 'medium', 'large', 'square'],
);
type BlockImage = v.InferInput<typeof BlockImageSchema>;
const PaginatedResponseWithCountBaseSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        meta: PaginationMetaWithCountSchema,
      }),
    ),
    ['meta'],
  ),
  v.metadata({
    description:
      'Base schema for paginated responses with total count (use allOf to extend with specific data type)',
  }),
);
type PaginatedResponseWithCountBase = v.InferInput<
  typeof PaginatedResponseWithCountBaseSchema
>;
const PaginationMetaSchema = v.pipe(
  v.union([PaginationMetaWithCountSchema, PaginationMetaWithoutCountSchema]),
  v.metadata({
    description:
      'Pagination metadata union matching pagination behavior with and without total counts',
  }),
);
type PaginationMeta = v.InferInput<typeof PaginationMetaSchema>;
const UserSchema = v.pipe(
  v.intersect([
    EmbeddedUserSchema,
    v.required(
      v.partial(
        v.object({
          created_at: v.pipe(
            v.string(),
            v.metadata({
              description: 'When the user was created',
            }),
            v.examples(['2023-01-15T10:30:00Z']),
          ),
          updated_at: v.pipe(
            v.string(),
            v.metadata({
              description: 'When the user was last updated',
            }),
            v.examples(['2023-06-20T14:45:00Z']),
          ),
          bio: v.pipe(
            v.union([MarkdownContentSchema, v.null(), v.undefined()]),
            v.metadata({
              description:
                'User biography with markdown, HTML, and plain text renderings',
            }),
          ),
          counts: UserCountsSchema,
          _links: v.intersect([
            LinksSchema,
            v.pipe(
              v.any(),
              v.metadata({
                description: 'HATEOAS links for navigation',
              }),
            ),
          ]),
        }),
      ),
      ['created_at', 'updated_at', 'counts', '_links'],
    ),
  ]),
  v.metadata({
    description: 'Full user representation',
  }),
);
type User = v.InferInput<typeof UserSchema>;
const GroupSchema = v.pipe(
  v.intersect([
    EmbeddedGroupSchema,
    v.required(
      v.partial(
        v.object({
          bio: v.pipe(
            v.union([MarkdownContentSchema, v.null(), v.undefined()]),
            v.metadata({
              description:
                'Group biography with markdown, HTML, and plain text renderings',
            }),
          ),
          created_at: v.pipe(
            v.string(),
            v.metadata({
              description: 'When the group was created',
            }),
            v.examples(['2023-01-15T10:30:00Z']),
          ),
          updated_at: v.pipe(
            v.string(),
            v.metadata({
              description: 'When the group was last updated',
            }),
            v.examples(['2023-06-20T14:45:00Z']),
          ),
          user: v.intersect([
            EmbeddedUserSchema,
            v.pipe(
              v.any(),
              v.metadata({
                description: 'User who owns/created the group',
              }),
            ),
          ]),
          counts: GroupCountsSchema,
          _links: v.intersect([
            LinksSchema,
            v.pipe(
              v.any(),
              v.metadata({
                description: 'HATEOAS links for navigation',
              }),
            ),
          ]),
        }),
      ),
      ['created_at', 'updated_at', 'user', 'counts', '_links'],
    ),
  ]),
  v.metadata({
    description: 'Full group representation',
  }),
);
type Group = v.InferInput<typeof GroupSchema>;
const CommentSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        id: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Unique identifier for the comment',
          }),
          v.examples([12345]),
        ),
        type: v.pipe(
          v.picklist(['Comment']),
          v.metadata({
            description: 'Comment type',
          }),
          v.examples(['Comment']),
        ),
        body: v.pipe(
          v.union([MarkdownContentSchema, v.null(), v.undefined()]),
          v.metadata({
            description:
              'Comment body with markdown, HTML, and plain text renderings',
          }),
        ),
        created_at: v.pipe(
          v.string(),
          v.metadata({
            description: 'When the comment was created',
          }),
          v.examples(['2023-01-15T10:30:00Z']),
        ),
        updated_at: v.pipe(
          v.string(),
          v.metadata({
            description: 'When the comment was last updated',
          }),
          v.examples(['2023-01-15T14:45:00Z']),
        ),
        user: EmbeddedUserSchema,
        _links: v.intersect([
          LinksSchema,
          v.pipe(
            v.any(),
            v.metadata({
              description: 'HATEOAS links for navigation',
            }),
          ),
        ]),
      }),
    ),
    ['id', 'type', 'created_at', 'updated_at', 'user', '_links'],
  ),
  v.metadata({
    description: 'A comment on a block',
  }),
);
type Comment = v.InferInput<typeof CommentSchema>;
const ChannelSchema = v.required(
  v.partial(
    v.object({
      id: v.pipe(
        v.pipe(v.number(), v.integer()),
        v.metadata({
          description: 'Unique identifier for the channel',
        }),
        v.examples([12345]),
      ),
      type: v.pipe(
        v.picklist(['Channel']),
        v.metadata({
          description: 'Channel type',
        }),
        v.examples(['Channel']),
      ),
      slug: v.pipe(
        v.string(),
        v.metadata({
          description: 'Channel URL slug',
        }),
        v.examples(['my-collection-abc123']),
      ),
      title: v.pipe(
        v.string(),
        v.metadata({
          description: 'Channel title',
        }),
        v.examples(['My Collection']),
      ),
      description: v.pipe(
        v.union([MarkdownContentSchema, v.null(), v.undefined()]),
        v.metadata({
          description: 'Channel description with multiple renderings',
        }),
      ),
      state: v.pipe(
        v.picklist(['available', 'deleted']),
        v.metadata({
          description:
            'Lifecycle state of the channel:\n- `available`: Channel is active and accessible\n- `deleted`: Channel has been soft-deleted\n',
        }),
        v.examples(['available']),
      ),
      visibility: v.pipe(
        v.picklist(['public', 'private', 'closed']),
        v.metadata({
          description:
            'Visibility level of the channel:\n- `public`: Anyone can view and connect to the channel\n- `private`: Only the owner and collaborators can view\n- `closed`: Anyone can view, but only collaborators can add content\n',
        }),
        v.examples(['public']),
      ),
      created_at: v.pipe(
        v.string(),
        v.metadata({
          description: 'When the channel was created',
        }),
        v.examples(['2023-01-15T10:30:00Z']),
      ),
      updated_at: v.pipe(
        v.string(),
        v.metadata({
          description: 'When the channel was last updated',
        }),
        v.examples(['2023-01-15T14:45:00Z']),
      ),
      owner: ChannelOwnerSchema,
      counts: ChannelCountsSchema,
      _links: v.intersect([
        LinksSchema,
        v.pipe(
          v.any(),
          v.metadata({
            description: 'HATEOAS links for navigation',
          }),
        ),
      ]),
      connection: v.pipe(
        v.union([ConnectionContextSchema, v.null(), v.undefined()]),
        v.metadata({
          description:
            "Connection context (only present when channel is returned as part of another channel's contents).\nContains position, pinned status, and information about who connected the channel.\n",
        }),
      ),
    }),
  ),
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
type Channel = v.InferInput<typeof ChannelSchema>;
const BaseBlockPropertiesSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        id: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Unique identifier for the block',
          }),
          v.examples([12345]),
        ),
        base_type: v.pipe(
          v.picklist(['Block']),
          v.metadata({
            description: 'Base type of the block (always "Block")',
          }),
          v.examples(['Block']),
        ),
        title: v.pipe(
          v.union([v.string(), v.null(), v.undefined()]),
          v.metadata({
            description: 'Block title',
          }),
          v.examples(['Interesting Article']),
        ),
        description: v.pipe(
          v.union([MarkdownContentSchema, v.null(), v.undefined()]),
          v.metadata({
            description: 'Block description with multiple renderings',
          }),
        ),
        state: v.pipe(
          v.picklist(['available', 'pending', 'failed', 'processing']),
          v.metadata({
            description:
              'Processing state of the block:\n- `available`: Block is ready and fully processed\n- `pending`: Block is queued for processing\n- `processing`: Block is currently being processed (e.g., image thumbnails, metadata extraction)\n- `failed`: Block processing failed (may still be viewable but incomplete)\n',
          }),
          v.examples(['available']),
        ),
        visibility: v.pipe(
          v.picklist(['public', 'private', 'orphan']),
          v.metadata({
            description:
              'Visibility level of the block:\n- `public`: Visible to everyone\n- `private`: Only visible to the owner\n- `orphan`: Block exists but is not connected to any channel\n',
          }),
          v.examples(['public']),
        ),
        comment_count: v.pipe(
          v.pipe(v.number(), v.integer()),
          v.metadata({
            description: 'Number of comments on the block',
          }),
          v.examples([5]),
        ),
        created_at: v.pipe(
          v.string(),
          v.metadata({
            description: 'When the block was created',
          }),
          v.examples(['2023-01-15T10:30:00Z']),
        ),
        updated_at: v.pipe(
          v.string(),
          v.metadata({
            description: 'When the block was last updated',
          }),
          v.examples(['2023-01-15T14:45:00Z']),
        ),
        user: EmbeddedUserSchema,
        source: v.pipe(
          v.union([BlockSourceSchema, v.null(), v.undefined()]),
          v.metadata({
            description:
              'Source URL and metadata (if block was created from a URL)',
          }),
        ),
        _links: v.intersect([
          LinksSchema,
          v.pipe(
            v.any(),
            v.metadata({
              description: 'HATEOAS links for navigation',
            }),
          ),
        ]),
        connection: v.pipe(
          v.union([ConnectionContextSchema, v.null(), v.undefined()]),
          v.metadata({
            description:
              'Connection context (only present when block is returned as part of channel contents).\nContains position, pinned status, and information about who connected the block.\n',
          }),
        ),
      }),
    ),
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
  ),
  v.metadata({
    description: 'Common properties shared by all block types',
  }),
);
type BaseBlockProperties = v.InferInput<typeof BaseBlockPropertiesSchema>;
const PaginatedResponseBaseSchema = v.pipe(
  v.required(
    v.partial(
      v.object({
        meta: PaginationMetaSchema,
      }),
    ),
    ['meta'],
  ),
  v.metadata({
    description:
      'Base schema for all paginated responses (use allOf to extend with specific data type)',
  }),
);
type PaginatedResponseBase = v.InferInput<typeof PaginatedResponseBaseSchema>;
const UserListSchema = v.pipe(
  v.required(
    v.object({
      data: v.pipe(
        v.array(UserSchema),
        v.metadata({
          description: 'Array of users',
        }),
      ),
    }),
    ['data'],
  ),
  v.metadata({
    description: 'Data payload containing an array of users',
  }),
);
type UserList = v.InferInput<typeof UserListSchema>;
const CommentListSchema = v.pipe(
  v.required(
    v.object({
      data: v.pipe(
        v.array(CommentSchema),
        v.metadata({
          description: 'Array of comments',
        }),
      ),
    }),
    ['data'],
  ),
  v.metadata({
    description: 'Data payload containing an array of comments',
  }),
);
type CommentList = v.InferInput<typeof CommentListSchema>;
const ChannelListSchema = v.pipe(
  v.required(
    v.object({
      data: v.pipe(
        v.array(ChannelSchema),
        v.metadata({
          description: 'Array of channels',
        }),
      ),
    }),
    ['data'],
  ),
  v.metadata({
    description: 'Data payload containing an array of channels',
  }),
);
type ChannelList = v.InferInput<typeof ChannelListSchema>;
const FollowableListSchema = v.pipe(
  v.required(
    v.object({
      data: v.pipe(
        v.array(v.union([UserSchema, ChannelSchema, GroupSchema])),
        v.metadata({
          description: 'Array of users, channels, and/or groups',
        }),
      ),
    }),
    ['data'],
  ),
  v.metadata({
    description:
      'Data payload containing followable items (users, channels, and groups)',
  }),
);
type FollowableList = v.InferInput<typeof FollowableListSchema>;
const TextBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.required(
      v.object({
        type: v.pipe(
          v.picklist(['Text']),
          v.metadata({
            description: 'Block type (always "Text" for TextBlock)',
          }),
        ),
        content: MarkdownContentSchema,
      }),
      ['type', 'content'],
    ),
  ]),
  v.metadata({
    description: 'A text block containing markdown content',
  }),
);
type TextBlock = v.InferInput<typeof TextBlockSchema>;
const ImageBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.required(
      v.object({
        type: v.pipe(
          v.picklist(['Image']),
          v.metadata({
            description: 'Block type (always "Image" for ImageBlock)',
          }),
        ),
        image: BlockImageSchema,
      }),
      ['type', 'image'],
    ),
  ]),
  v.metadata({
    description: 'An image block containing an uploaded or scraped image',
  }),
);
type ImageBlock = v.InferInput<typeof ImageBlockSchema>;
const LinkBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.required(
      v.partial(
        v.object({
          type: v.pipe(
            v.picklist(['Link']),
            v.metadata({
              description: 'Block type (always "Link" for LinkBlock)',
            }),
          ),
          image: v.pipe(
            v.union([BlockImageSchema, v.null(), v.undefined()]),
            v.metadata({
              description: 'Preview image (if available)',
            }),
          ),
          content: v.pipe(
            v.union([MarkdownContentSchema, v.null(), v.undefined()]),
            v.metadata({
              description: 'Extracted text content from the link',
            }),
          ),
        }),
      ),
      ['type'],
    ),
  ]),
  v.metadata({
    description: 'A link block representing a URL with optional preview',
  }),
);
type LinkBlock = v.InferInput<typeof LinkBlockSchema>;
const AttachmentBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.required(
      v.partial(
        v.object({
          type: v.pipe(
            v.picklist(['Attachment']),
            v.metadata({
              description:
                'Block type (always "Attachment" for AttachmentBlock)',
            }),
          ),
          attachment: BlockAttachmentSchema,
          image: v.pipe(
            v.union([BlockImageSchema, v.null(), v.undefined()]),
            v.metadata({
              description:
                'Preview image (for PDFs and other previewable files)',
            }),
          ),
        }),
      ),
      ['type', 'attachment'],
    ),
  ]),
  v.metadata({
    description: 'An attachment block containing an uploaded file',
  }),
);
type AttachmentBlock = v.InferInput<typeof AttachmentBlockSchema>;
const EmbedBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.required(
      v.partial(
        v.object({
          type: v.pipe(
            v.picklist(['Embed']),
            v.metadata({
              description: 'Block type (always "Embed" for EmbedBlock)',
            }),
          ),
          embed: BlockEmbedSchema,
          image: v.pipe(
            v.union([BlockImageSchema, v.null(), v.undefined()]),
            v.metadata({
              description: 'Thumbnail image (if available)',
            }),
          ),
        }),
      ),
      ['type', 'embed'],
    ),
  ]),
  v.metadata({
    description:
      'An embed block containing embedded media (video, audio, etc.)',
  }),
);
type EmbedBlock = v.InferInput<typeof EmbedBlockSchema>;
const UserListResponseSchema = v.pipe(
  v.intersect([UserListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of users with total count',
  }),
);
type UserListResponse = v.InferInput<typeof UserListResponseSchema>;
const CommentListResponseSchema = v.pipe(
  v.intersect([CommentListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of comments with total count',
  }),
);
type CommentListResponse = v.InferInput<typeof CommentListResponseSchema>;
const ChannelListResponseSchema = v.pipe(
  v.intersect([ChannelListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of channels with total count',
  }),
);
type ChannelListResponse = v.InferInput<typeof ChannelListResponseSchema>;
const FollowableListResponseSchema = v.pipe(
  v.intersect([FollowableListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description:
      'Paginated list of followable items (users, channels, and groups) with total count',
  }),
);
type FollowableListResponse = v.InferInput<typeof FollowableListResponseSchema>;
const BlockSchema = v.pipe(
  v.union([
    TextBlockSchema,
    ImageBlockSchema,
    LinkBlockSchema,
    AttachmentBlockSchema,
    EmbedBlockSchema,
  ]),
  v.metadata({
    description:
      'A block is a piece of content on Are.na. Blocks come in different types,\neach with its own set of fields. Use the `type` field to determine which\nfields are available.\n',
  }),
);
type Block = v.InferInput<typeof BlockSchema>;
const ConnectableListSchema = v.pipe(
  v.required(
    v.object({
      data: v.pipe(
        v.array(
          v.union([
            TextBlockSchema,
            ImageBlockSchema,
            LinkBlockSchema,
            AttachmentBlockSchema,
            EmbedBlockSchema,
            ChannelSchema,
          ]),
        ),
        v.metadata({
          description: 'Array of blocks and channels',
        }),
      ),
    }),
    ['data'],
  ),
  v.metadata({
    description:
      'Data payload containing mixed content that can be connected to channels (blocks and channels)',
  }),
);
type ConnectableList = v.InferInput<typeof ConnectableListSchema>;
const EverythingListSchema = v.pipe(
  v.required(
    v.object({
      data: v.pipe(
        v.array(
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
        v.metadata({
          description: 'Array of results (blocks, channels, users, or groups)',
        }),
      ),
    }),
    ['data'],
  ),
  v.metadata({
    description: 'Data payload containing all content types',
  }),
);
type EverythingList = v.InferInput<typeof EverythingListSchema>;
const ConnectableListResponseSchema = v.pipe(
  v.intersect([ConnectableListSchema, PaginatedResponseBaseSchema]),
  v.metadata({
    description: 'Paginated list of connectable content (blocks and channels)',
  }),
);
type ConnectableListResponse = v.InferInput<
  typeof ConnectableListResponseSchema
>;
const EverythingListResponseSchema = v.pipe(
  v.intersect([EverythingListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of all content types with total count',
  }),
);
type EverythingListResponse = v.InferInput<typeof EverythingListResponseSchema>;

export {
  ErrorSchema,
  type Error,
  RateLimitErrorSchema,
  type RateLimitError,
  LinkSchema,
  type Link,
  MarkdownContentSchema,
  type MarkdownContent,
  EmbeddedUserSchema,
  type EmbeddedUser,
  EmbeddedGroupSchema,
  type EmbeddedGroup,
  UserCountsSchema,
  type UserCounts,
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
  BlockProviderSchema,
  type BlockProvider,
  ImageVersionSchema,
  type ImageVersion,
  BlockEmbedSchema,
  type BlockEmbed,
  BlockAttachmentSchema,
  type BlockAttachment,
  ChannelCountsSchema,
  type ChannelCounts,
  PaginationMetaWithCountSchema,
  type PaginationMetaWithCount,
  PaginationMetaWithoutCountSchema,
  type PaginationMetaWithoutCount,
  PingResponseSchema,
  type PingResponse,
  LinksSchema,
  type Links,
  ConnectionContextSchema,
  type ConnectionContext,
  ChannelOwnerSchema,
  type ChannelOwner,
  BlockSourceSchema,
  type BlockSource,
  BlockImageSchema,
  type BlockImage,
  PaginatedResponseWithCountBaseSchema,
  type PaginatedResponseWithCountBase,
  PaginationMetaSchema,
  type PaginationMeta,
  UserSchema,
  type User,
  GroupSchema,
  type Group,
  CommentSchema,
  type Comment,
  ChannelSchema,
  type Channel,
  BaseBlockPropertiesSchema,
  type BaseBlockProperties,
  PaginatedResponseBaseSchema,
  type PaginatedResponseBase,
  UserListSchema,
  type UserList,
  CommentListSchema,
  type CommentList,
  ChannelListSchema,
  type ChannelList,
  FollowableListSchema,
  type FollowableList,
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
  UserListResponseSchema,
  type UserListResponse,
  CommentListResponseSchema,
  type CommentListResponse,
  ChannelListResponseSchema,
  type ChannelListResponse,
  FollowableListResponseSchema,
  type FollowableListResponse,
  BlockSchema,
  type Block,
  ConnectableListSchema,
  type ConnectableList,
  EverythingListSchema,
  type EverythingList,
  ConnectableListResponseSchema,
  type ConnectableListResponse,
  EverythingListResponseSchema,
  type EverythingListResponse,
};
