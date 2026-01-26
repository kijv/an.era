import * as v from 'valibot';

const ErrorSchema = v.object({
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
});
type Error = v.InferOutput<typeof ErrorSchema>;
const RateLimitErrorSchema = v.pipe(
  v.object({
    error: v.object({
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
          v.object({}),
          v.examples([{ guest: 30, free: 120, premium: 300, supporter: 600 }]),
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
  }),
  v.metadata({
    description:
      'Rate limit exceeded error response with upgrade information and suggestions',
  }),
);
type RateLimitError = v.InferOutput<typeof RateLimitErrorSchema>;
const LinksSchema = v.pipe(
  v.object({}),
  v.metadata({
    description:
      'HATEOAS links for navigation and discovery.\nFollows HAL (Hypertext Application Language) format where link relationships \nare expressed as object keys (e.g., "self", "user", "channels").\n',
  }),
);
type Links = v.InferOutput<typeof LinksSchema>;
const LinkSchema = v.pipe(
  v.object({
    href: v.pipe(
      v.string(),
      v.metadata({
        description: 'The URL of the linked resource',
      }),
      v.examples(['https://api.are.na/v3/blocks/12345']),
    ),
  }),
  v.metadata({
    description:
      'A hypermedia link containing the URL of a linked resource.\nThe relationship type is expressed by the key in the parent _links object.\n',
  }),
);
type Link = v.InferOutput<typeof LinkSchema>;
const MarkdownContentSchema = v.pipe(
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
  v.metadata({
    description: 'Markdown content with multiple renderings',
  }),
);
type MarkdownContent = v.InferOutput<typeof MarkdownContentSchema>;
const EmbeddedUserSchema = v.pipe(
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
  v.metadata({
    description:
      'Embedded user representation (used when user is nested in other resources)',
  }),
);
type EmbeddedUser = v.InferOutput<typeof EmbeddedUserSchema>;
const ConnectionContextSchema = v.pipe(
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
      v.examples([false]),
    ),
    connected_at: v.pipe(
      v.string(),
      v.metadata({
        description: 'When the item was connected to the channel',
      }),
      v.examples(['2023-01-15T10:30:00Z']),
    ),
  }),
  v.metadata({
    description:
      "Connection metadata that describes how an item is connected to a channel.\nThis is only present when the item is returned as part of a channel's contents.\n",
  }),
);
type ConnectionContext = v.InferOutput<typeof ConnectionContextSchema>;
const EmbeddedGroupSchema = v.pipe(
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
  v.metadata({
    description:
      'Embedded group representation (used when group is nested in other resources)',
  }),
);
type EmbeddedGroup = v.InferOutput<typeof EmbeddedGroupSchema>;
const UserSchema = v.pipe(
  v.intersect([
    EmbeddedUserSchema,
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
    }),
  ]),
  v.metadata({
    description: 'Full user representation',
  }),
);
type User = v.InferOutput<typeof UserSchema>;
const UserCountsSchema = v.pipe(
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
  v.metadata({
    description: 'Counts of various items for the user',
  }),
);
type UserCounts = v.InferOutput<typeof UserCountsSchema>;
const GroupSchema = v.pipe(
  v.intersect([
    EmbeddedGroupSchema,
    v.object({
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
    }),
  ]),
  v.metadata({
    description: 'Full group representation',
  }),
);
type Group = v.InferOutput<typeof GroupSchema>;
const GroupCountsSchema = v.pipe(
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
  v.metadata({
    description: 'Counts of various items for the group',
  }),
);
type GroupCounts = v.InferOutput<typeof GroupCountsSchema>;
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
type ContentTypeFilter = v.InferOutput<typeof ContentTypeFilterSchema>;
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
type SearchTypeFilter = v.InferOutput<typeof SearchTypeFilterSchema>;
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
type FileExtension = v.InferOutput<typeof FileExtensionSchema>;
const ConnectionSortSchema = v.pipe(
  v.picklist(['created_at_desc', 'created_at_asc']),
  v.metadata({
    description:
      'Sort order for connection lists (channels containing a block/channel, followers)',
  }),
);
type ConnectionSort = v.InferOutput<typeof ConnectionSortSchema>;
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
type ChannelContentSort = v.InferOutput<typeof ChannelContentSortSchema>;
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
type ContentSort = v.InferOutput<typeof ContentSortSchema>;
const BaseBlockPropertiesSchema = v.pipe(
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
  }),
  v.metadata({
    description: 'Common properties shared by all block types',
  }),
);
type BaseBlockProperties = v.InferOutput<typeof BaseBlockPropertiesSchema>;
const TextBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.object({
      type: v.pipe(
        v.picklist(['Text']),
        v.metadata({
          description: 'Block type (always "Text" for TextBlock)',
        }),
      ),
    }),
  ]),
  v.metadata({
    description: 'A text block containing markdown content',
  }),
);
type TextBlock = v.InferOutput<typeof TextBlockSchema>;
const ImageBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.object({
      type: v.pipe(
        v.picklist(['Image']),
        v.metadata({
          description: 'Block type (always "Image" for ImageBlock)',
        }),
      ),
    }),
  ]),
  v.metadata({
    description: 'An image block containing an uploaded or scraped image',
  }),
);
type ImageBlock = v.InferOutput<typeof ImageBlockSchema>;
const LinkBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.object({
      type: v.pipe(
        v.picklist(['Link']),
        v.metadata({
          description: 'Block type (always "Link" for LinkBlock)',
        }),
      ),
    }),
  ]),
  v.metadata({
    description: 'A link block representing a URL with optional preview',
  }),
);
type LinkBlock = v.InferOutput<typeof LinkBlockSchema>;
const AttachmentBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.object({
      type: v.pipe(
        v.picklist(['Attachment']),
        v.metadata({
          description: 'Block type (always "Attachment" for AttachmentBlock)',
        }),
      ),
    }),
  ]),
  v.metadata({
    description: 'An attachment block containing an uploaded file',
  }),
);
type AttachmentBlock = v.InferOutput<typeof AttachmentBlockSchema>;
const EmbedBlockSchema = v.pipe(
  v.intersect([
    BaseBlockPropertiesSchema,
    v.object({
      type: v.pipe(
        v.picklist(['Embed']),
        v.metadata({
          description: 'Block type (always "Embed" for EmbedBlock)',
        }),
      ),
    }),
  ]),
  v.metadata({
    description:
      'An embed block containing embedded media (video, audio, etc.)',
  }),
);
type EmbedBlock = v.InferOutput<typeof EmbedBlockSchema>;
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
type Block = v.InferOutput<typeof BlockSchema>;
const BlockSourceSchema = v.object({
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
});
type BlockSource = v.InferOutput<typeof BlockSourceSchema>;
const BlockProviderSchema = v.object({
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
});
type BlockProvider = v.InferOutput<typeof BlockProviderSchema>;
const BlockImageSchema = v.object({
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
});
type BlockImage = v.InferOutput<typeof BlockImageSchema>;
const ImageVersionSchema = v.pipe(
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
  v.metadata({
    description:
      'A resized/processed version of an image with multiple resolution URLs',
  }),
);
type ImageVersion = v.InferOutput<typeof ImageVersionSchema>;
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
type BlockEmbed = v.InferOutput<typeof BlockEmbedSchema>;
const BlockAttachmentSchema = v.object({
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
});
type BlockAttachment = v.InferOutput<typeof BlockAttachmentSchema>;
const CommentSchema = v.pipe(
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
  }),
  v.metadata({
    description: 'A comment on a block',
  }),
);
type Comment = v.InferOutput<typeof CommentSchema>;
const ChannelOwnerSchema = v.pipe(
  v.union([EmbeddedUserSchema, EmbeddedGroupSchema]),
  v.metadata({
    description: 'Channel owner (User or Group)',
  }),
);
type ChannelOwner = v.InferOutput<typeof ChannelOwnerSchema>;
const ChannelCountsSchema = v.pipe(
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
  v.metadata({
    description: 'Counts of various items in the channel',
  }),
);
type ChannelCounts = v.InferOutput<typeof ChannelCountsSchema>;
const ChannelSchema = v.object({
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
});
type Channel = v.InferOutput<typeof ChannelSchema>;
const PaginationMetaWithCountSchema = v.pipe(
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
  v.metadata({
    description: 'Pagination metadata when total counts are available',
  }),
);
type PaginationMetaWithCount = v.InferOutput<
  typeof PaginationMetaWithCountSchema
>;
const PaginationMetaWithoutCountSchema = v.pipe(
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
  v.metadata({
    description: 'Pagination metadata when total counts are not available',
  }),
);
type PaginationMetaWithoutCount = v.InferOutput<
  typeof PaginationMetaWithoutCountSchema
>;
const PaginationMetaSchema = v.pipe(
  v.union([PaginationMetaWithCountSchema, PaginationMetaWithoutCountSchema]),
  v.metadata({
    description:
      'Pagination metadata union matching pagination behavior with and without total counts',
  }),
);
type PaginationMeta = v.InferOutput<typeof PaginationMetaSchema>;
const PaginatedResponseBaseSchema = v.pipe(
  v.object({}),
  v.metadata({
    description:
      'Base schema for all paginated responses (use allOf to extend with specific data type)',
  }),
);
type PaginatedResponseBase = v.InferOutput<typeof PaginatedResponseBaseSchema>;
const PaginatedResponseWithCountBaseSchema = v.pipe(
  v.object({}),
  v.metadata({
    description:
      'Base schema for paginated responses with total count (use allOf to extend with specific data type)',
  }),
);
type PaginatedResponseWithCountBase = v.InferOutput<
  typeof PaginatedResponseWithCountBaseSchema
>;
const UserListSchema = v.pipe(
  v.object({
    data: v.pipe(
      v.array(UserSchema),
      v.metadata({
        description: 'Array of users',
      }),
    ),
  }),
  v.metadata({
    description: 'Data payload containing an array of users',
  }),
);
type UserList = v.InferOutput<typeof UserListSchema>;
const ChannelListSchema = v.pipe(
  v.object({
    data: v.pipe(
      v.array(ChannelSchema),
      v.metadata({
        description: 'Array of channels',
      }),
    ),
  }),
  v.metadata({
    description: 'Data payload containing an array of channels',
  }),
);
type ChannelList = v.InferOutput<typeof ChannelListSchema>;
const ConnectableListSchema = v.pipe(
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
  v.metadata({
    description:
      'Data payload containing mixed content that can be connected to channels (blocks and channels)',
  }),
);
type ConnectableList = v.InferOutput<typeof ConnectableListSchema>;
const FollowableListSchema = v.pipe(
  v.object({
    data: v.pipe(
      v.array(v.union([UserSchema, ChannelSchema, GroupSchema])),
      v.metadata({
        description: 'Array of users, channels, and/or groups',
      }),
    ),
  }),
  v.metadata({
    description:
      'Data payload containing followable items (users, channels, and groups)',
  }),
);
type FollowableList = v.InferOutput<typeof FollowableListSchema>;
const EverythingListSchema = v.pipe(
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
  v.metadata({
    description: 'Data payload containing all content types',
  }),
);
type EverythingList = v.InferOutput<typeof EverythingListSchema>;
const UserListResponseSchema = v.pipe(
  v.intersect([UserListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of users with total count',
  }),
);
type UserListResponse = v.InferOutput<typeof UserListResponseSchema>;
const ChannelListResponseSchema = v.pipe(
  v.intersect([ChannelListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of channels with total count',
  }),
);
type ChannelListResponse = v.InferOutput<typeof ChannelListResponseSchema>;
const ConnectableListResponseSchema = v.pipe(
  v.intersect([ConnectableListSchema, PaginatedResponseBaseSchema]),
  v.metadata({
    description: 'Paginated list of connectable content (blocks and channels)',
  }),
);
type ConnectableListResponse = v.InferOutput<
  typeof ConnectableListResponseSchema
>;
const FollowableListResponseSchema = v.pipe(
  v.intersect([FollowableListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description:
      'Paginated list of followable items (users, channels, and groups) with total count',
  }),
);
type FollowableListResponse = v.InferOutput<
  typeof FollowableListResponseSchema
>;
const EverythingListResponseSchema = v.pipe(
  v.intersect([EverythingListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of all content types with total count',
  }),
);
type EverythingListResponse = v.InferOutput<
  typeof EverythingListResponseSchema
>;
const CommentListSchema = v.pipe(
  v.object({
    data: v.pipe(
      v.array(CommentSchema),
      v.metadata({
        description: 'Array of comments',
      }),
    ),
  }),
  v.metadata({
    description: 'Data payload containing an array of comments',
  }),
);
type CommentList = v.InferOutput<typeof CommentListSchema>;
const CommentListResponseSchema = v.pipe(
  v.intersect([CommentListSchema, PaginatedResponseWithCountBaseSchema]),
  v.metadata({
    description: 'Paginated list of comments with total count',
  }),
);
type CommentListResponse = v.InferOutput<typeof CommentListResponseSchema>;
const PingResponseSchema = v.pipe(
  v.object({
    status: v.pipe(v.picklist(['ok']), v.examples(['ok'])),
  }),
  v.metadata({
    description: 'Health check response',
  }),
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
