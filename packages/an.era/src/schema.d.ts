/* oxlint-disable */
export interface components {
    schemas: {
        Error: {
            /**
             * @description Error message
             * @example Not Found
             */
            error: string;
            /**
             * @description HTTP status code
             * @example 404
             */
            code: number;
            /** @description Additional error details */
            details?: {
                /**
                 * @description Detailed error message
                 * @example The resource you are looking for does not exist.
                 */
                message?: string;
            };
        };
        /** @description Rate limit exceeded error response with upgrade information and suggestions */
        RateLimitError: {
            error: {
                /**
                 * @description Error type identifier
                 * @example rate_limit_exceeded
                 */
                type: string;
                /**
                 * @description Human-readable error message
                 * @example Rate limit of 30 requests per minute exceeded for guest tier. Try again later.
                 */
                message: string;
                /**
                 * @description User's current tier
                 * @example guest
                 */
                tier: components["schemas"]["UserTier"];
                /**
                 * @description Request limit per minute for this tier
                 * @example 30
                 */
                limit: number;
                /**
                 * @description Time window for rate limits
                 * @example 1 minute
                 */
                limit_window?: string;
                /**
                 * @description Suggested seconds to wait before retrying
                 * @example 65
                 */
                retry_after: number;
                current_status?: {
                    /** @example guest */
                    tier?: string;
                    /**
                     * @example {
                     *       "guest": 30,
                     *       "free": 120,
                     *       "premium": 300,
                     *       "supporter": 600
                     *     }
                     */
                    limits?: Record<string, never>;
                    upgrade_path?: {
                        /** @example Guest (30 req/min) */
                        current?: string;
                        /** @example Free Account (120 req/min) */
                        recommended?: string;
                        /**
                         * @example [
                         *       "4x higher rate limit",
                         *       "Persistent authentication",
                         *       "API access"
                         *     ]
                         */
                        benefits?: string[];
                        /** @example Sign up at https://are.na/signup */
                        action?: string;
                    };
                };
                /**
                 * @description Tier-specific optimization suggestions
                 * @example [
                 *       "Sign up for a free account to get 120 requests per minute",
                 *       "Implement exponential backoff with jitter",
                 *       "Cache responses when possible to reduce API calls",
                 *       "Consider batch requests if available"
                 *     ]
                 */
                suggestions: string[];
                /**
                 * @description Information about header usage
                 * @example Check 'X-RateLimit-*' headers on successful requests for current usage
                 */
                headers_note?: string;
            };
        };
        /**
         * @description HATEOAS links for navigation and discovery.
         *     Follows HAL (Hypertext Application Language) format where link relationships
         *     are expressed as object keys (e.g., "self", "user", "channels").
         */
        Links: {
            /** @description Link to the current resource (always present) */
            self: components["schemas"]["Link"];
        } & {
            [key: string]: components["schemas"]["Link"];
        };
        /**
         * @description A hypermedia link containing the URL of a linked resource.
         *     The relationship type is expressed by the key in the parent _links object.
         */
        Link: {
            /**
             * Format: uri
             * @description The URL of the linked resource
             * @example https://api.are.na/v3/blocks/12345
             */
            href: string;
        };
        /** @description Markdown content with multiple renderings */
        MarkdownContent: {
            /**
             * @description Original markdown value
             * @example This is **only** a [test](https://example.com).
             */
            markdown: string;
            /**
             * @description HTML rendering of the markdown
             * @example <p>This is <strong>only</strong> a <a href="https://example.com" target="_blank" rel="nofollow noopener">test</a>.</p>
             */
            html: string;
            /**
             * @description Plain text rendering of the markdown
             * @example This is only a test (https://example.com).
             */
            plain: string;
        };
        /** @description Embedded user representation (used when user is nested in other resources) */
        EmbeddedUser: {
            /**
             * @description Unique identifier for the user
             * @example 12345
             */
            id: number;
            /**
             * @description User type (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            type: "User";
            /**
             * @description User's display name
             * @example John Doe
             */
            name: string;
            /**
             * @description URL-safe identifier (use this in API paths)
             * @example john-doe
             */
            slug: string;
            /**
             * Format: uri
             * @description URL to user's avatar image
             * @example https://d2w9rnfcy7mm78.cloudfront.net/12345/avatar.jpg
             */
            avatar: string | null;
            /**
             * @description User's initials
             * @example JD
             */
            initials: string;
        };
        /** @description Embedded connection representation used when connection is nested in other resources */
        EmbeddedConnection: {
            /**
             * @description Unique identifier for the connection
             * @example 98765
             */
            id: number;
            /**
             * @description Position of the item within the channel
             * @example 1
             */
            position: number;
            /**
             * @description Whether the item is pinned
             * @example false
             */
            pinned: boolean;
            /**
             * Format: date-time
             * @description When the item was connected
             * @example 2023-01-15T10:30:00Z
             */
            connected_at: string;
            /** @description User who created this connection */
            connected_by: components["schemas"]["EmbeddedUser"] | null;
        };
        /**
         * @description Full connection resource with abilities and links.
         *     Used for GET /v3/connections/:id
         */
        Connection: components["schemas"]["EmbeddedConnection"] & {
            can: components["schemas"]["ConnectionAbilities"];
            _links: components["schemas"]["Links"];
        };
        /** @description Actions the current user can perform on this connection */
        ConnectionAbilities: {
            /**
             * @description Whether the user can remove this connection
             * @example true
             */
            remove: boolean;
        };
        /** @description Embedded group representation (used when group is nested in other resources) */
        EmbeddedGroup: {
            /**
             * @description Unique identifier for the group
             * @example 67890
             */
            id: number;
            /**
             * @description Group type (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            type: "Group";
            /**
             * @description Group's name
             * @example Design Team
             */
            name: string;
            /**
             * @description Group's URL slug
             * @example design-team-abc123
             */
            slug: string;
            /**
             * Format: uri
             * @description URL to group's avatar image
             * @example https://d2w9rnfcy7mm78.cloudfront.net/groups/67890/avatar.jpg
             */
            avatar: string | null;
            /**
             * @description Group's initials
             * @example DT
             */
            initials: string;
        };
        /** @description Full user representation */
        User: components["schemas"]["EmbeddedUser"] & {
            /**
             * Format: date-time
             * @description When the user was created
             * @example 2023-01-15T10:30:00Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the user was last updated
             * @example 2023-06-20T14:45:00Z
             */
            updated_at: string;
            /** @description User biography with markdown, HTML, and plain text renderings */
            bio?: components["schemas"]["MarkdownContent"] | null;
            /** @description Denotes plan or other distinction */
            badge: components["schemas"]["UserBadge"] | null;
            /** @description User's subscription tier */
            tier: components["schemas"]["UserTier"];
            counts: components["schemas"]["UserCounts"];
            /** @description HATEOAS links for navigation */
            _links: components["schemas"]["Links"];
        };
        /** @description Counts of various items for the user */
        UserCounts: {
            /**
             * @description Number of channels owned by the user
             * @example 24
             */
            channels: number;
            /**
             * @description Number of followers
             * @example 156
             */
            followers: number;
            /**
             * @description Number of users being followed
             * @example 89
             */
            following: number;
        };
        /** @description Full group representation */
        Group: components["schemas"]["EmbeddedGroup"] & {
            /** @description Group biography with markdown, HTML, and plain text renderings */
            bio?: components["schemas"]["MarkdownContent"] | null;
            /**
             * Format: date-time
             * @description When the group was created
             * @example 2023-01-15T10:30:00Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the group was last updated
             * @example 2023-06-20T14:45:00Z
             */
            updated_at: string;
            /** @description User who owns/created the group */
            user: components["schemas"]["EmbeddedUser"];
            counts: components["schemas"]["GroupCounts"];
            /** @description HATEOAS links for navigation */
            _links: components["schemas"]["Links"];
        };
        /** @description Counts of various items for the group */
        GroupCounts: {
            /**
             * @description Number of channels owned by the group
             * @example 12
             */
            channels: number;
            /**
             * @description Number of users in the group
             * @example 5
             */
            users: number;
        };
        /**
         * @description Denotes plan or other distinction:
         *     - `staff`: Are.na staff member
         *     - `investor`: Investor
         *     - `supporter`: Supporter subscriber
         *     - `premium`: Premium subscriber
         * @enum {string}
         */
        UserBadge: "staff" | "investor" | "supporter" | "premium";
        /**
         * @description User subscription tier:
         *     - `guest`: Unauthenticated user
         *     - `free`: Free account
         *     - `premium`: Premium subscriber
         *     - `supporter`: Supporter tier
         * @enum {string}
         */
        UserTier: "guest" | "free" | "premium" | "supporter";
        /**
         * @description Processing state of a block.
         *     - `processing`: Being processed (e.g., image resizing)
         *     - `available`: Ready for display
         *     - `failed`: Processing failed
         * @enum {string}
         */
        BlockState: "processing" | "available" | "failed";
        /**
         * @description Visibility of a block.
         *     - `public`: Visible to everyone
         *     - `private`: Only visible to owner
         *     - `orphan`: Not connected to any channel
         * @enum {string}
         */
        BlockVisibility: "public" | "private" | "orphan";
        /**
         * @description Lifecycle state of a channel.
         *     - `available`: Active and accessible
         *     - `deleted`: Soft deleted
         * @enum {string}
         */
        ChannelState: "available" | "deleted";
        /**
         * @description Filter connections by who created them.
         *     - `ALL`: All connections (default)
         *     - `OWN`: Only connections by the current user
         *     - `EXCLUDE_OWN`: Exclude connections by the current user
         * @enum {string}
         */
        ConnectionFilter: "ALL" | "OWN" | "EXCLUDE_OWN";
        /**
         * @description Type of entity that can be followed.
         *     - `User`: A user
         *     - `Channel`: A channel
         *     - `Group`: A group
         * @enum {string}
         */
        FollowableType: "User" | "Channel" | "Group";
        /**
         * @description Type of entity that can be connected to a channel.
         *     - `Block`: A block
         *     - `Channel`: A channel
         * @enum {string}
         */
        ConnectableType: "Block" | "Channel";
        /**
         * @description Filter by content type.
         *     - `Text`: Text blocks
         *     - `Image`: Image blocks
         *     - `Link`: Link blocks
         *     - `Attachment`: File attachments
         *     - `Embed`: Embedded media (video, audio, etc.)
         *     - `Channel`: Channels only
         *     - `Block`: All block types (excludes channels)
         * @enum {string}
         */
        ContentTypeFilter: "Text" | "Image" | "Link" | "Attachment" | "Embed" | "Channel" | "Block";
        /**
         * @description Filter by content type. Includes users and groups.
         *     - `All`: Everything (default)
         *     - `Text`, `Image`, `Link`, `Attachment`, `Embed`: Block types
         *     - `Block`: All block types
         *     - `Channel`: Channels only
         *     - `User`: Users only
         *     - `Group`: Groups only
         * @enum {string}
         */
        SearchTypeFilter: "All" | "Text" | "Image" | "Link" | "Attachment" | "Embed" | "Channel" | "Block" | "User" | "Group";
        /**
         * @description File extension for filtering attachment and image blocks.
         *     Common values: pdf, jpg, png, gif, mp4, mp3, doc, xls.
         * @enum {string}
         */
        FileExtension: "aac" | "ai" | "aiff" | "avi" | "avif" | "bmp" | "csv" | "doc" | "docx" | "eps" | "epub" | "fla" | "gif" | "h264" | "heic" | "heif" | "ind" | "indd" | "jpeg" | "jpg" | "key" | "kml" | "kmz" | "latex" | "m4a" | "ma" | "mb" | "mid" | "midi" | "mov" | "mp3" | "mp4" | "mp4v" | "mpeg" | "mpg" | "mpg4" | "numbers" | "oga" | "ogg" | "ogv" | "otf" | "pages" | "pdf" | "pgp" | "png" | "ppt" | "pptx" | "psd" | "svg" | "swa" | "swf" | "tex" | "texi" | "texinfo" | "tfm" | "tif" | "tiff" | "torrent" | "ttc" | "ttf" | "txt" | "wav" | "webm" | "webp" | "wma" | "xls" | "xlsx" | "xlt";
        /**
         * @description Sort order for relationship lists.
         *     - `created_at_desc`: Newest first (default)
         *     - `created_at_asc`: Oldest first
         * @enum {string}
         */
        ConnectionSort: "created_at_desc" | "created_at_asc";
        /**
         * @description Sort order for channel contents.
         *     - `position_asc`: Manual order (default)
         *     - `position_desc`: Manual order, reversed
         *     - `created_at_desc`: Newest first
         *     - `created_at_asc`: Oldest first
         *     - `updated_at_desc`: Recently updated first
         *     - `updated_at_asc`: Least recently updated first
         * @enum {string}
         */
        ChannelContentSort: "position_asc" | "position_desc" | "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc";
        /**
         * @description Sort order for user or group content.
         *     - `created_at_desc`: Newest first (default)
         *     - `created_at_asc`: Oldest first
         *     - `updated_at_desc`: Recently updated first
         *     - `updated_at_asc`: Least recently updated first
         * @enum {string}
         */
        ContentSort: "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc";
        /**
         * @description Sort order for groups.
         *     - `name_asc`: Alphabetical (default)
         *     - `name_desc`: Reverse alphabetical
         *     - `created_at_desc`: Newest first
         *     - `created_at_asc`: Oldest first
         *     - `updated_at_desc`: Recently updated first
         *     - `updated_at_asc`: Least recently updated first
         * @enum {string}
         */
        GroupSort: "name_asc" | "name_desc" | "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc";
        /**
         * @description Limit search to a specific context.
         *     - `all`: Everything accessible to the user (default)
         *     - `my`: Only the current user's own content
         *     - `following`: Content from followed users and channels
         * @enum {string}
         */
        SearchScope: "all" | "my" | "following";
        /**
         * @description Sort order for search results.
         *     - `score_desc`: Most relevant first (default)
         *     - `created_at_desc`: Newest first
         *     - `created_at_asc`: Oldest first
         *     - `updated_at_desc`: Recently updated first
         *     - `updated_at_asc`: Least recently updated first
         *     - `name_asc`: Alphabetical A-Z
         *     - `name_desc`: Alphabetical Z-A
         *     - `connections_count_desc`: Most connected first
         *     - `random`: Random (use `seed` for reproducibility)
         * @enum {string}
         */
        SearchSort: "score_desc" | "created_at_desc" | "created_at_asc" | "updated_at_desc" | "updated_at_asc" | "name_asc" | "name_desc" | "connections_count_desc" | "random";
        /**
         * @description Visibility level of a channel:
         *     - `public`: Anyone can view and connect to the channel
         *     - `private`: Only the owner and collaborators can view
         *     - `closed`: Anyone can view, but only collaborators can add content
         * @enum {string}
         */
        ChannelVisibility: "public" | "private" | "closed";
        /**
         * @description Movement action for repositioning a connection within a channel.
         *     "Top" refers to the visually first position (newest items appear at the top).
         *     - `insert_at`: Move to a specific position (requires `position` parameter)
         *     - `move_to_top`: Move to the visually first position
         *     - `move_to_bottom`: Move to the visually last position
         *     - `move_up`: Move one position up (towards the top)
         *     - `move_down`: Move one position down (towards the bottom)
         * @enum {string}
         */
        Movement: "insert_at" | "move_to_top" | "move_to_bottom" | "move_up" | "move_down";
        /**
         * @description Array of channel IDs or slugs. Accepts numeric IDs, string IDs, or
         *     channel slugs (e.g., `[123, "456", "my-channel-slug"]`).
         * @example [
         *       123,
         *       "my-channel"
         *     ]
         */
        ChannelIds: (number | string)[];
        /** @description A presigned S3 upload URL for a single file */
        PresignedFile: {
            /**
             * Format: uri
             * @description Presigned S3 PUT URL. Upload your file by sending a PUT request
             *     to this URL with the file bytes as the body and the `Content-Type`
             *     header matching the content_type you specified.
             * @example https://s3.amazonaws.com/arena_images-temp/uploads/550e8400-e29b-41d4-a716-446655440000/photo.jpg?X-Amz-...
             */
            upload_url: string;
            /**
             * @description The S3 object key where the file will be stored
             * @example uploads/550e8400-e29b-41d4-a716-446655440000/photo.jpg
             */
            key: string;
            /**
             * @description The content type that was validated and should be used in the PUT request
             * @example image/jpeg
             */
            content_type: string;
        };
        /** @description Response containing presigned S3 upload URLs */
        PresignResponse: {
            /** @description Presigned URLs for each requested file */
            files: components["schemas"]["PresignedFile"][];
            /**
             * @description Seconds until the presigned URLs expire
             * @example 3600
             */
            expires_in: number;
        };
        /** @description Input fields for creating a block */
        BlockInput: {
            /**
             * @description The content to create a block from. Can be either:
             *     - A URL (creates Image, Link, or Embed block based on content type)
             *     - Text/markdown content (creates a Text block)
             * @example https://example.com/image.jpg
             */
            value: string;
            /**
             * @description Optional title for the block
             * @example My Block Title
             */
            title?: string;
            /**
             * @description Optional description (supports markdown)
             * @example A description of this block
             */
            description?: string;
            /**
             * Format: uri
             * @description Original source URL for attribution
             * @example https://example.com/123
             */
            original_source_url?: string;
            /**
             * @description Title of the original source
             * @example Example Source
             */
            original_source_title?: string;
            /**
             * @description Alt text for images (accessibility)
             * @example Beige flags
             */
            alt_text?: string;
        };
        /** @description Response returned when a batch is accepted for processing */
        BatchResponse: {
            /**
             * Format: uuid
             * @description Unique identifier for this batch
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            batch_id: string;
            /**
             * @description Initial status of the batch
             * @enum {string}
             */
            status: "pending";
            /**
             * @description Total number of blocks queued for creation
             * @example 10
             */
            total: number;
        };
        /** @description Current status of a batch processing job */
        BatchStatus: {
            /**
             * Format: uuid
             * @description Unique identifier for this batch
             */
            batch_id: string;
            /**
             * @description Current processing status
             * @enum {string}
             */
            status: "pending" | "processing" | "completed" | "failed";
            /** @description Total number of blocks in the batch */
            total: number;
            /** @description Number of blocks created so far */
            successful_count: number;
            /** @description Number of blocks that failed */
            failed_count: number;
            /** @description Successfully created blocks */
            successful?: {
                /** @description Original index in the request array */
                index: number;
                /** @description ID of the created block */
                block_id: number;
            }[];
            /** @description Blocks that failed to create */
            failed?: {
                /** @description Original index in the request array */
                index: number;
                /** @description Error message */
                error: string;
            }[];
            /**
             * Format: date-time
             * @description When the batch was submitted
             */
            created_at?: string;
            /**
             * Format: date-time
             * @description When the batch finished processing (present when completed or failed)
             */
            completed_at?: string;
            /** @description Top-level error message if the entire batch failed */
            error?: string;
        };
        /**
         * @description A block is a piece of content on Are.na. Blocks come in different types,
         *     each with its own set of fields. Use the `type` field to determine which
         *     fields are available.
         */
        Block: components["schemas"]["TextBlock"] | components["schemas"]["ImageBlock"] | components["schemas"]["LinkBlock"] | components["schemas"]["AttachmentBlock"] | components["schemas"]["EmbedBlock"] | components["schemas"]["PendingBlock"];
        /** @description Common properties shared by all block types */
        BaseBlockProperties: {
            /**
             * @description Unique identifier for the block
             * @example 12345
             */
            id: number;
            /**
             * @description Base type of the block (always "Block")
             * @example Block
             * @enum {string}
             */
            base_type: "Block";
            /**
             * @description Block title
             * @example Interesting Article
             */
            title?: string | null;
            /** @description Block description with multiple renderings */
            description?: components["schemas"]["MarkdownContent"] | null;
            /** @example available */
            state: components["schemas"]["BlockState"];
            /** @example public */
            visibility: components["schemas"]["BlockVisibility"];
            /**
             * @description Number of comments on the block
             * @example 5
             */
            comment_count: number;
            /**
             * Format: date-time
             * @description When the block was created
             * @example 2023-01-15T10:30:00Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the block was last updated
             * @example 2023-01-15T14:45:00Z
             */
            updated_at: string;
            user: components["schemas"]["EmbeddedUser"];
            /** @description Source URL and metadata (if block was created from a URL) */
            source?: components["schemas"]["BlockSource"] | null;
            /** @description HATEOAS links for navigation */
            _links: components["schemas"]["Links"];
            /**
             * @description Connection context (only present when block is returned as part of channel contents).
             *     Contains position, pinned status, and information about who connected the block.
             */
            connection?: components["schemas"]["EmbeddedConnection"] | null;
            /**
             * @description Abilities object (only present for full block responses, not in channel contents).
             *     Indicates what actions the current user can perform on this block.
             */
            can?: components["schemas"]["BlockAbilities"] | null;
        };
        /** @description Actions the current user can perform on the block */
        BlockAbilities: {
            /**
             * @description Whether the user can manage (update/delete) this block
             * @example true
             */
            manage: boolean;
            /**
             * @description Whether the user can comment on this block
             * @example true
             */
            comment: boolean;
            /**
             * @description Whether the user can connect this block to channels
             * @example true
             */
            connect: boolean;
        };
        /** @description A text block containing markdown content */
        TextBlock: components["schemas"]["BaseBlockProperties"] & {
            /**
             * @description Block type (always "Text" for TextBlock)
             * @enum {string}
             */
            type: "Text";
            /** @description Text content with markdown, HTML, and plain text renderings */
            content: components["schemas"]["MarkdownContent"];
        } & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Text";
        };
        /** @description An image block containing an uploaded or scraped image */
        ImageBlock: components["schemas"]["BaseBlockProperties"] & {
            /**
             * @description Block type (always "Image" for ImageBlock)
             * @enum {string}
             */
            type: "Image";
            /** @description Image data with multiple resolutions */
            image: components["schemas"]["BlockImage"];
        } & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Image";
        };
        /** @description A link block representing a URL with optional preview */
        LinkBlock: components["schemas"]["BaseBlockProperties"] & {
            /**
             * @description Block type (always "Link" for LinkBlock)
             * @enum {string}
             */
            type: "Link";
            /** @description Preview image (if available) */
            image?: components["schemas"]["BlockImage"] | null;
            /** @description Extracted text content from the link */
            content?: components["schemas"]["MarkdownContent"] | null;
        } & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Link";
        };
        /** @description An attachment block containing an uploaded file */
        AttachmentBlock: components["schemas"]["BaseBlockProperties"] & {
            /**
             * @description Block type (always "Attachment" for AttachmentBlock)
             * @enum {string}
             */
            type: "Attachment";
            /** @description Attachment file data */
            attachment: components["schemas"]["BlockAttachment"];
            /** @description Preview image (for PDFs and other previewable files) */
            image?: components["schemas"]["BlockImage"] | null;
        } & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Attachment";
        };
        /** @description An embed block containing embedded media (video, audio, etc.) */
        EmbedBlock: components["schemas"]["BaseBlockProperties"] & {
            /**
             * @description Block type (always "Embed" for EmbedBlock)
             * @enum {string}
             */
            type: "Embed";
            /** @description Embed data including HTML and dimensions */
            embed: components["schemas"]["BlockEmbed"];
            /** @description Thumbnail image (if available) */
            image?: components["schemas"]["BlockImage"] | null;
        } & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "Embed";
        };
        /**
         * @description A block that is currently being processed. The final type (Text, Image, Link, etc.)
         *     will be determined once processing completes. Check the `state` field for processing status.
         */
        PendingBlock: components["schemas"]["BaseBlockProperties"] & {
            /**
             * @description Block type (always "PendingBlock" for blocks being processed)
             * @enum {string}
             */
            type: "PendingBlock";
        } & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "PendingBlock";
        };
        BlockSource: {
            /**
             * Format: uri
             * @description Source URL
             * @example https://example.com/article
             */
            url: string;
            /**
             * @description Source title
             * @example Original Article Title
             */
            title?: string | null;
            provider?: components["schemas"]["BlockProvider"] | null;
        };
        BlockProvider: {
            /**
             * @description Provider name (from parsed URI host)
             * @example Example.com
             */
            name: string;
            /**
             * Format: uri
             * @description Provider URL (from parsed URI scheme and host)
             * @example https://example.com
             */
            url: string;
        };
        BlockImage: {
            /**
             * @description Alternative text associated with the image
             * @example Scanned collage of magazine cutouts
             */
            alt_text?: string | null;
            /**
             * @description BlurHash representation of the image for progressive loading
             * @example LEHV6nWB2yk8pyo0adR*.7kCMdnj
             */
            blurhash?: string | null;
            /**
             * @description Original image width in pixels
             * @example 1920
             */
            width?: number | null;
            /**
             * @description Original image height in pixels
             * @example 1080
             */
            height?: number | null;
            /**
             * Format: uri
             * @description URL to the original image
             * @example https://d2w9rnfcy7mm78.cloudfront.net/12345/original_image.jpg
             */
            src?: string;
            /**
             * Format: float
             * @description Image aspect ratio (width / height)
             * @example 1.7778
             */
            aspect_ratio?: number | null;
            /**
             * @description Image content type
             * @example image/jpeg
             */
            content_type?: string;
            /**
             * @description Image filename
             * @example image.jpg
             */
            filename?: string;
            /**
             * @description File size in bytes
             * @example 1024000
             */
            file_size?: number | null;
            /**
             * Format: date-time
             * @description When the image was last updated
             * @example 2023-01-15T14:45:00Z
             */
            updated_at?: string;
            /** @description Small image version (thumb) */
            small: components["schemas"]["ImageVersion"];
            /** @description Medium image version (display) */
            medium: components["schemas"]["ImageVersion"];
            /** @description Large image version */
            large: components["schemas"]["ImageVersion"];
            /** @description Square cropped image version */
            square: components["schemas"]["ImageVersion"];
        };
        /** @description A resized/processed version of an image with multiple resolution URLs */
        ImageVersion: {
            /**
             * Format: uri
             * @description Default image URL (1x resolution)
             * @example https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image.jpg
             */
            src: string;
            /**
             * Format: uri
             * @description 2x resolution image URL for high DPI displays
             * @example https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image@2x.jpg
             */
            src_2x: string;
            /**
             * @description Width of the resized image in pixels
             * @example 640
             */
            width?: number | null;
            /**
             * @description Height of the resized image in pixels
             * @example 480
             */
            height?: number | null;
        };
        BlockEmbed: {
            /**
             * Format: uri
             * @description Embed URL
             * @example https://www.youtube.com/embed/abc123
             */
            url?: string | null;
            /**
             * @description Embed type
             * @example youtube
             */
            type?: string | null;
            /**
             * @description Embed title
             * @example Video Title
             */
            title?: string | null;
            /**
             * @description Author name
             * @example Author Name
             */
            author_name?: string | null;
            /**
             * Format: uri
             * @description Author URL
             * @example https://example.com/author
             */
            author_url?: string | null;
            /**
             * Format: uri
             * @description Embed source URL
             * @example https://www.youtube.com/watch?v=abc123
             */
            source_url?: string | null;
            /**
             * @description Embed width
             * @example 640
             */
            width?: number | null;
            /**
             * @description Embed height
             * @example 480
             */
            height?: number | null;
            /**
             * @description Embed HTML
             * @example <iframe src='...'></iframe>
             */
            html?: string | null;
            /**
             * Format: uri
             * @description Thumbnail URL
             * @example https://example.com/thumbnail.jpg
             */
            thumbnail_url?: string | null;
        };
        BlockAttachment: {
            /**
             * @description Attachment filename
             * @example document.pdf
             */
            filename?: string | null;
            /**
             * @description Attachment content type
             * @example application/pdf
             */
            content_type?: string | null;
            /**
             * @description File size in bytes
             * @example 2048000
             */
            file_size?: number | null;
            /**
             * @description File extension
             * @example pdf
             */
            file_extension?: string | null;
            /**
             * Format: date-time
             * @description When the attachment was last updated
             */
            updated_at?: string | null;
            /**
             * Format: uri
             * @description Attachment download URL
             * @example https://attachments.are.na/12345/document.pdf
             */
            url: string;
        };
        /** @description A comment on a block */
        Comment: {
            /**
             * @description Unique identifier for the comment
             * @example 12345
             */
            id: number;
            /**
             * @description Comment type
             * @example Comment
             * @enum {string}
             */
            type: "Comment";
            /** @description Comment body with markdown, HTML, and plain text renderings */
            body?: components["schemas"]["MarkdownContent"] | null;
            /**
             * Format: date-time
             * @description When the comment was created
             * @example 2023-01-15T10:30:00Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the comment was last updated
             * @example 2023-01-15T14:45:00Z
             */
            updated_at: string;
            user: components["schemas"]["EmbeddedUser"];
            _links: components["schemas"]["Links"] & unknown;
        };
        Channel: {
            /**
             * @description Unique identifier for the channel
             * @example 12345
             */
            id: number;
            /**
             * @description Channel type
             * @example Channel
             * @enum {string}
             */
            type: "Channel";
            /**
             * @description Channel URL slug
             * @example my-collection-abc123
             */
            slug: string;
            /**
             * @description Channel title
             * @example My Collection
             */
            title: string;
            /** @description Channel description with multiple renderings */
            description?: components["schemas"]["MarkdownContent"] | null;
            /** @example available */
            state: components["schemas"]["ChannelState"];
            visibility: components["schemas"]["ChannelVisibility"];
            /**
             * Format: date-time
             * @description When the channel was created
             * @example 2023-01-15T10:30:00Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the channel was last updated
             * @example 2023-01-15T14:45:00Z
             */
            updated_at: string;
            owner: components["schemas"]["ChannelOwner"];
            counts: components["schemas"]["ChannelCounts"];
            /**
             * @description Collaborators on this channel (users and groups).
             *     Only present when channel is returned as a full resource, not when embedded.
             */
            collaborators?: components["schemas"]["ChannelCollaborator"][];
            _links: components["schemas"]["Links"] & unknown;
            /**
             * @description Connection context (only present when channel is returned as part of another channel's contents).
             *     Contains position, pinned status, and information about who connected the channel.
             */
            connection?: components["schemas"]["EmbeddedConnection"] | null;
            /**
             * @description Actions the current user can perform on this channel.
             *     Only present when channel is returned as a full resource, not when embedded.
             */
            can?: components["schemas"]["ChannelAbilities"] | null;
        };
        /** @description Channel owner (User or Group) */
        ChannelOwner: components["schemas"]["EmbeddedUser"] | components["schemas"]["EmbeddedGroup"];
        /** @description Channel collaborator (User or Group) */
        ChannelCollaborator: components["schemas"]["EmbeddedUser"] | components["schemas"]["EmbeddedGroup"];
        /** @description Actions the current user can perform on the channel */
        ChannelAbilities: {
            /**
             * @description Whether the user can add blocks to this channel
             * @example true
             */
            add_to: boolean;
            /**
             * @description Whether the user can update this channel
             * @example false
             */
            update: boolean;
            /**
             * @description Whether the user can delete this channel
             * @example false
             */
            destroy: boolean;
            /**
             * @description Whether the user can add/remove collaborators
             * @example false
             */
            manage_collaborators: boolean;
        };
        /** @description Counts of various items in the channel */
        ChannelCounts: {
            /**
             * @description Number of blocks in the channel
             * @example 42
             */
            blocks: number;
            /**
             * @description Number of channels connected to this channel
             * @example 8
             */
            channels: number;
            /**
             * @description Total number of contents (blocks + channels)
             * @example 50
             */
            contents: number;
            /**
             * @description Number of collaborators on the channel
             * @example 3
             */
            collaborators: number;
        };
        /** @description Pagination metadata */
        PaginationMeta: {
            /**
             * @description Current page number
             * @example 1
             */
            current_page: number;
            /**
             * @description Next page number (null if last page)
             * @example 2
             */
            next_page?: number | null;
            /** @description Previous page number (null if first page) */
            prev_page?: number | null;
            /**
             * @description Number of items per page
             * @example 25
             */
            per_page: number;
            /**
             * @description Total number of pages available
             * @example 5
             */
            total_pages: number;
            /**
             * @description Total number of items available
             * @example 120
             */
            total_count: number;
            /**
             * @description Whether there are more pages available
             * @example true
             */
            has_more_pages: boolean;
        };
        /** @description Base schema for all paginated responses (use allOf to extend with specific data type) */
        PaginatedResponse: {
            meta: components["schemas"]["PaginationMeta"];
        };
        /** @description Data payload containing an array of users */
        UserList: {
            /** @description Array of users */
            data: components["schemas"]["User"][];
        };
        /** @description Data payload containing an array of channels */
        ChannelList: {
            /** @description Array of channels */
            data: components["schemas"]["Channel"][];
        };
        /** @description Data payload containing mixed content that can be connected to channels (blocks and channels) */
        ConnectableList: {
            /** @description Array of blocks and channels */
            data: (components["schemas"]["TextBlock"] | components["schemas"]["ImageBlock"] | components["schemas"]["LinkBlock"] | components["schemas"]["AttachmentBlock"] | components["schemas"]["EmbedBlock"] | components["schemas"]["Channel"])[];
        };
        /** @description Data payload containing followable items (users, channels, and groups) */
        FollowableList: {
            /** @description Array of users, channels, and/or groups */
            data: (components["schemas"]["User"] | components["schemas"]["Channel"] | components["schemas"]["Group"])[];
        };
        /** @description Data payload containing all content types */
        EverythingList: {
            /** @description Array of results (blocks, channels, users, or groups) */
            data: (components["schemas"]["TextBlock"] | components["schemas"]["ImageBlock"] | components["schemas"]["LinkBlock"] | components["schemas"]["AttachmentBlock"] | components["schemas"]["EmbedBlock"] | components["schemas"]["Channel"] | components["schemas"]["User"] | components["schemas"]["Group"])[];
        };
        /** @description Paginated list of users with total count */
        UserListResponse: components["schemas"]["UserList"] & components["schemas"]["PaginatedResponse"];
        /** @description Paginated list of channels with total count */
        ChannelListResponse: components["schemas"]["ChannelList"] & components["schemas"]["PaginatedResponse"];
        /** @description Data payload containing an array of groups */
        GroupList: {
            /** @description Array of groups */
            data: components["schemas"]["Group"][];
        };
        /** @description Paginated list of groups with total count */
        GroupListResponse: components["schemas"]["GroupList"] & components["schemas"]["PaginatedResponse"];
        /** @description Paginated list of connectable content (blocks and channels) */
        ConnectableListResponse: components["schemas"]["ConnectableList"] & components["schemas"]["PaginatedResponse"];
        /** @description Paginated list of followable items (users, channels, and groups) with total count */
        FollowableListResponse: components["schemas"]["FollowableList"] & components["schemas"]["PaginatedResponse"];
        /** @description Paginated list of all content types with total count */
        EverythingListResponse: components["schemas"]["EverythingList"] & components["schemas"]["PaginatedResponse"];
        /** @description Data payload containing an array of comments */
        CommentList: {
            /** @description Array of comments */
            data: components["schemas"]["Comment"][];
        };
        /** @description Paginated list of comments with total count */
        CommentListResponse: components["schemas"]["CommentList"] & components["schemas"]["PaginatedResponse"];
        /** @description Health check response */
        PingResponse: {
            /**
             * @example ok
             * @enum {string}
             */
            status: "ok";
        };
    };
    responses: {
        /** @description Unauthorized */
        UnauthorizedResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Resource not found */
        NotFoundResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Validation error */
        ValidationErrorResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Forbidden - insufficient permissions to access this resource */
        ForbiddenResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Bad request - missing or invalid parameters */
        BadRequestResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "error": "Bad Request",
                 *       "code": 400,
                 *       "details": {
                 *         "message": "body is required"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Validation failed - the request was well-formed but contained semantic errors */
        UnprocessableEntityResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "error": "Validation failed",
                 *       "code": 422,
                 *       "details": {
                 *         "errors": {
                 *           "title": [
                 *             "can't be blank"
                 *           ]
                 *         }
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Rate limit exceeded */
        RateLimitResponse: {
            headers: {
                /**
                 * @description Seconds to wait before retrying
                 * @example 65
                 */
                "Retry-After"?: string;
                /**
                 * @description Request limit per minute
                 * @example 30
                 */
                "X-RateLimit-Limit"?: string;
                /**
                 * @description User's current tier
                 * @example guest
                 */
                "X-RateLimit-Tier"?: string;
                /**
                 * @description Time window in seconds
                 * @example 60
                 */
                "X-RateLimit-Window"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["RateLimitError"];
            };
        };
    };
    parameters: {
        /**
         * @description Page number for pagination
         * @example 1
         */
        PageParam: number;
        /**
         * @description Number of items per page (max 100)
         * @example 24
         */
        PerParam: number;
        /** @description Resource ID */
        IdParam: number;
        /** @description Resource ID or slug */
        SlugOrIdParam: string;
        /**
         * @description Sort by the date the relationship was created.
         * @example created_at_desc
         */
        ConnectionSortParam: components["schemas"]["ConnectionSort"];
        /**
         * @description Sort by creation or last update time.
         * @example created_at_desc
         */
        ContentSortParam: components["schemas"]["ContentSort"];
        /**
         * @description Sort groups by name or date.
         * @example name_asc
         */
        GroupSortParam: components["schemas"]["GroupSort"];
        /**
         * @description Sort channel contents. Use `position` for the owner's manual
         *     arrangement, or sort by date. Defaults to `position_desc`.
         * @example position_desc
         */
        ChannelContentSortParam: components["schemas"]["ChannelContentSort"];
        /**
         * @description Filter to a specific content type.
         * @example Image
         */
        ContentTypeFilterParam: components["schemas"]["ContentTypeFilter"];
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
