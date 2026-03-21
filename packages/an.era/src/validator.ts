/**
 * Auto-generated Valibot validators from OpenAPI spec.
 * Do not edit by hand.
 */

import * as v from 'valibot';

export const ErrorSchema = v.object({ error: v.string(), code: v.pipe(v.number(), v.integer()), details: v.optional(v.object({ message: v.optional(v.string()) })) });

export const UserTierSchema = v.picklist(["guest", "free", "premium", "supporter"]);

export const RateLimitErrorSchema = v.object({ error: v.object({ type: v.string(), message: v.string(), tier: UserTierSchema, limit: v.pipe(v.number(), v.integer()), limit_window: v.optional(v.string()), retry_after: v.pipe(v.number(), v.integer()), current_status: v.optional(v.object({ tier: v.optional(v.string()), limits: v.optional(v.object({  })), upgrade_path: v.optional(v.object({ current: v.optional(v.string()), recommended: v.optional(v.string()), benefits: v.optional(v.array(v.string())), action: v.optional(v.string()) })) })), suggestions: v.array(v.string()), headers_note: v.optional(v.string()) }) });

export const LinkSchema = v.object({ href: v.pipe(v.string(), v.url()) });

export const LinksSchema = v.objectWithRest({ self: LinkSchema }, LinkSchema);

export const MarkdownContentSchema = v.object({ markdown: v.string(), html: v.string(), plain: v.string() });

export const EmbeddedUserSchema = v.object({ id: v.pipe(v.number(), v.integer()), type: v.literal("User"), name: v.string(), slug: v.string(), avatar: v.unknown(), initials: v.string() });

export const EmbeddedConnectionSchema = v.object({ id: v.pipe(v.number(), v.integer()), position: v.pipe(v.number(), v.integer()), pinned: v.boolean(), connected_at: v.pipe(v.string(), v.isoTimestamp()), connected_by: v.union([EmbeddedUserSchema, v.null()]) });

export const ConnectionAbilitiesSchema = v.object({ remove: v.boolean() });

export const ConnectionSchema = v.intersect([EmbeddedConnectionSchema, v.object({ can: ConnectionAbilitiesSchema, _links: LinksSchema })]);

export const EmbeddedGroupSchema = v.object({ id: v.pipe(v.number(), v.integer()), type: v.literal("Group"), name: v.string(), slug: v.string(), avatar: v.unknown(), initials: v.string() });

export const UserBadgeSchema = v.picklist(["staff", "investor", "supporter", "premium"]);

export const UserCountsSchema = v.object({ channels: v.pipe(v.number(), v.integer()), followers: v.pipe(v.number(), v.integer()), following: v.pipe(v.number(), v.integer()) });

export const UserSchema = v.intersect([EmbeddedUserSchema, v.object({ created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), bio: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), badge: v.union([UserBadgeSchema, v.null()]), tier: UserTierSchema, counts: UserCountsSchema, _links: LinksSchema })]);

export const GroupCountsSchema = v.object({ channels: v.pipe(v.number(), v.integer()), users: v.pipe(v.number(), v.integer()) });

export const GroupSchema = v.intersect([EmbeddedGroupSchema, v.object({ bio: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), user: EmbeddedUserSchema, counts: GroupCountsSchema, _links: LinksSchema })]);

export const BlockStateSchema = v.picklist(["processing", "available", "failed"]);

export const BlockVisibilitySchema = v.picklist(["public", "private", "orphan"]);

export const ChannelStateSchema = v.picklist(["available", "deleted"]);

export const ConnectionFilterSchema = v.picklist(["ALL", "OWN", "EXCLUDE_OWN"]);

export const FollowableTypeSchema = v.picklist(["User", "Channel", "Group"]);

export const ConnectableTypeSchema = v.picklist(["Block", "Channel"]);

export const ContentTypeFilterSchema = v.picklist(["Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block"]);

export const SearchTypeFilterSchema = v.picklist(["All", "Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block", "User", "Group"]);

export const FileExtensionSchema = v.picklist(["aac", "ai", "aiff", "avi", "avif", "bmp", "csv", "doc", "docx", "eps", "epub", "fla", "gif", "h264", "heic", "heif", "ind", "indd", "jpeg", "jpg", "key", "kml", "kmz", "latex", "m4a", "ma", "mb", "mid", "midi", "mov", "mp3", "mp4", "mp4v", "mpeg", "mpg", "mpg4", "numbers", "oga", "ogg", "ogv", "otf", "pages", "pdf", "pgp", "png", "ppt", "pptx", "psd", "svg", "swa", "swf", "tex", "texi", "texinfo", "tfm", "tif", "tiff", "torrent", "ttc", "ttf", "txt", "wav", "webm", "webp", "wma", "xls", "xlsx", "xlt"]);

export const ConnectionSortSchema = v.picklist(["created_at_desc", "created_at_asc"]);

export const ChannelContentSortSchema = v.picklist(["position_asc", "position_desc", "created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"]);

export const ContentSortSchema = v.picklist(["created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"]);

export const SearchScopeSchema = v.picklist(["all", "my", "following"]);

export const SearchSortSchema = v.picklist(["score_desc", "created_at_desc", "created_at_asc", "updated_at_desc", "updated_at_asc", "name_asc", "name_desc", "connections_count_desc", "random"]);

export const ChannelVisibilitySchema = v.picklist(["public", "private", "closed"]);

export const MovementSchema = v.picklist(["insert_at", "move_to_top", "move_to_bottom", "move_up", "move_down"]);

export const ChannelIdsSchema = v.pipe(v.array(v.union([v.pipe(v.number(), v.integer()), v.string()])), v.minLength(1), v.maxLength(20));

export const PresignedFileSchema = v.object({ upload_url: v.pipe(v.string(), v.url()), key: v.string(), content_type: v.string() });

export const PresignResponseSchema = v.object({ files: v.array(PresignedFileSchema), expires_in: v.pipe(v.number(), v.integer()) });

export const BlockInputSchema = v.object({ value: v.string(), title: v.optional(v.string()), description: v.optional(v.string()), original_source_url: v.optional(v.pipe(v.string(), v.url())), original_source_title: v.optional(v.string()), alt_text: v.optional(v.string()) });

export const BatchResponseSchema = v.object({ batch_id: v.pipe(v.string(), v.uuid()), status: v.literal("pending"), total: v.pipe(v.number(), v.integer()) });

export const BatchStatusSchema = v.object({ batch_id: v.pipe(v.string(), v.uuid()), status: v.picklist(["pending", "processing", "completed", "failed"]), total: v.pipe(v.number(), v.integer()), successful_count: v.pipe(v.number(), v.integer()), failed_count: v.pipe(v.number(), v.integer()), successful: v.optional(v.array(v.object({ index: v.pipe(v.number(), v.integer()), block_id: v.pipe(v.number(), v.integer()) }))), failed: v.optional(v.array(v.object({ index: v.pipe(v.number(), v.integer()), error: v.string() }))), created_at: v.optional(v.pipe(v.string(), v.isoTimestamp())), completed_at: v.optional(v.pipe(v.string(), v.isoTimestamp())), error: v.optional(v.string()) });

export const BlockProviderSchema = v.object({ name: v.string(), url: v.pipe(v.string(), v.url()) });

export const BlockSourceSchema = v.object({ url: v.pipe(v.string(), v.url()), title: v.optional(v.unknown()), provider: v.optional(v.nullable(v.union([BlockProviderSchema, v.null()]))) });

export const BlockAbilitiesSchema = v.object({ manage: v.boolean(), comment: v.boolean(), connect: v.boolean() });

export const BaseBlockPropertiesSchema = v.object({ id: v.pipe(v.number(), v.integer()), base_type: v.literal("Block"), title: v.optional(v.unknown()), description: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), state: BlockStateSchema, visibility: BlockVisibilitySchema, comment_count: v.pipe(v.number(), v.integer()), created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), user: EmbeddedUserSchema, source: v.optional(v.nullable(v.union([BlockSourceSchema, v.null()]))), _links: LinksSchema, connection: v.optional(v.nullable(v.union([EmbeddedConnectionSchema, v.null()]))), can: v.optional(v.nullable(v.union([BlockAbilitiesSchema, v.null()]))) });

export const TextBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ type: v.literal("Text"), content: MarkdownContentSchema }), v.object({ type: v.literal("Text") })]);

export const ImageVersionSchema = v.object({ src: v.pipe(v.string(), v.url()), src_2x: v.pipe(v.string(), v.url()), width: v.optional(v.unknown()), height: v.optional(v.unknown()) });

export const BlockImageSchema = v.object({ alt_text: v.optional(v.unknown()), blurhash: v.optional(v.unknown()), width: v.optional(v.unknown()), height: v.optional(v.unknown()), src: v.optional(v.pipe(v.string(), v.url())), aspect_ratio: v.optional(v.unknown()), content_type: v.optional(v.string()), filename: v.optional(v.string()), file_size: v.optional(v.unknown()), updated_at: v.optional(v.pipe(v.string(), v.isoTimestamp())), small: ImageVersionSchema, medium: ImageVersionSchema, large: ImageVersionSchema, square: ImageVersionSchema });

export const ImageBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ type: v.literal("Image"), image: BlockImageSchema }), v.object({ type: v.literal("Image") })]);

export const LinkBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ type: v.literal("Link"), image: v.optional(v.nullable(v.union([BlockImageSchema, v.null()]))), content: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))) }), v.object({ type: v.literal("Link") })]);

export const BlockAttachmentSchema = v.object({ filename: v.optional(v.unknown()), content_type: v.optional(v.unknown()), file_size: v.optional(v.unknown()), file_extension: v.optional(v.unknown()), updated_at: v.optional(v.unknown()), url: v.pipe(v.string(), v.url()) });

export const AttachmentBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ type: v.literal("Attachment"), attachment: BlockAttachmentSchema, image: v.optional(v.nullable(v.union([BlockImageSchema, v.null()]))) }), v.object({ type: v.literal("Attachment") })]);

export const BlockEmbedSchema = v.object({ url: v.optional(v.unknown()), type: v.optional(v.unknown()), title: v.optional(v.unknown()), author_name: v.optional(v.unknown()), author_url: v.optional(v.unknown()), source_url: v.optional(v.unknown()), width: v.optional(v.unknown()), height: v.optional(v.unknown()), html: v.optional(v.unknown()), thumbnail_url: v.optional(v.unknown()) });

export const EmbedBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ type: v.literal("Embed"), embed: BlockEmbedSchema, image: v.optional(v.nullable(v.union([BlockImageSchema, v.null()]))) }), v.object({ type: v.literal("Embed") })]);

export const PendingBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ type: v.literal("PendingBlock") })]);

export const BlockSchema = v.union([TextBlockSchema, ImageBlockSchema, LinkBlockSchema, AttachmentBlockSchema, EmbedBlockSchema, PendingBlockSchema]);

export const CommentSchema = v.object({ id: v.pipe(v.number(), v.integer()), type: v.literal("Comment"), body: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), user: EmbeddedUserSchema, _links: LinksSchema });

export const ChannelOwnerSchema = v.union([EmbeddedUserSchema, EmbeddedGroupSchema]);

export const ChannelCountsSchema = v.object({ blocks: v.pipe(v.number(), v.integer()), channels: v.pipe(v.number(), v.integer()), contents: v.pipe(v.number(), v.integer()), collaborators: v.pipe(v.number(), v.integer()) });

export const ChannelCollaboratorSchema = v.union([EmbeddedUserSchema, EmbeddedGroupSchema]);

export const ChannelAbilitiesSchema = v.object({ add_to: v.boolean(), update: v.boolean(), destroy: v.boolean(), manage_collaborators: v.boolean() });

export const ChannelSchema = v.object({ id: v.pipe(v.number(), v.integer()), type: v.literal("Channel"), slug: v.string(), title: v.string(), description: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), state: ChannelStateSchema, visibility: ChannelVisibilitySchema, created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), owner: ChannelOwnerSchema, counts: ChannelCountsSchema, collaborators: v.optional(v.array(ChannelCollaboratorSchema)), _links: LinksSchema, connection: v.optional(v.nullable(v.union([EmbeddedConnectionSchema, v.null()]))), can: v.optional(v.nullable(v.union([ChannelAbilitiesSchema, v.null()]))) });

export const PaginationMetaSchema = v.object({ current_page: v.pipe(v.number(), v.integer()), next_page: v.optional(v.unknown()), prev_page: v.optional(v.unknown()), per_page: v.pipe(v.number(), v.integer()), total_pages: v.pipe(v.number(), v.integer()), total_count: v.pipe(v.number(), v.integer()), has_more_pages: v.boolean() });

export const PaginatedResponseSchema = v.object({ meta: PaginationMetaSchema });

export const UserListSchema = v.object({ data: v.array(UserSchema) });

export const ChannelListSchema = v.object({ data: v.array(ChannelSchema) });

export const ConnectableListSchema = v.object({ data: v.array(v.union([TextBlockSchema, ImageBlockSchema, LinkBlockSchema, AttachmentBlockSchema, EmbedBlockSchema, ChannelSchema])) });

export const FollowableListSchema = v.object({ data: v.array(v.union([UserSchema, ChannelSchema, GroupSchema])) });

export const EverythingListSchema = v.object({ data: v.array(v.union([TextBlockSchema, ImageBlockSchema, LinkBlockSchema, AttachmentBlockSchema, EmbedBlockSchema, ChannelSchema, UserSchema, GroupSchema])) });

export const UserListResponseSchema = v.intersect([UserListSchema, PaginatedResponseSchema]);

export const ChannelListResponseSchema = v.intersect([ChannelListSchema, PaginatedResponseSchema]);

export const ConnectableListResponseSchema = v.intersect([ConnectableListSchema, PaginatedResponseSchema]);

export const FollowableListResponseSchema = v.intersect([FollowableListSchema, PaginatedResponseSchema]);

export const EverythingListResponseSchema = v.intersect([EverythingListSchema, PaginatedResponseSchema]);

export const CommentListSchema = v.object({ data: v.array(CommentSchema) });

export const CommentListResponseSchema = v.intersect([CommentListSchema, PaginatedResponseSchema]);

export const PingResponseSchema = v.object({ status: v.literal("ok") });

export const ChannelContentSortParamParamSchema = ChannelContentSortSchema;

export const ConnectionSortParamParamSchema = ConnectionSortSchema;

export const ContentSortParamParamSchema = ContentSortSchema;

export const ContentTypeFilterParamParamSchema = ContentTypeFilterSchema;

export const IdParamParamSchema = v.pipe(v.number(), v.integer());

export const PageParamParamSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const PerParamParamSchema = v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100));

export const SlugOrIdParamParamSchema = v.string();

export const createOAuthTokenFormSchema = v.object({ grant_type: v.picklist(["authorization_code", "client_credentials"]), client_id: v.optional(v.string()), client_secret: v.optional(v.string()), code: v.optional(v.string()), redirect_uri: v.optional(v.pipe(v.string(), v.url())), code_verifier: v.optional(v.string()) });

export const createOAuthTokenResponseSchema = v.object({ access_token: v.string(), token_type: v.literal("Bearer"), scope: v.string(), created_at: v.pipe(v.number(), v.integer()) });

export const getOpenapiSpecResponseSchema = v.string();

export const getOpenapiSpecJsonResponseSchema = v.object({  });

export const getPingResponseSchema = PingResponseSchema;

export const presignUploadRequestSchema = v.object({ files: v.pipe(v.array(v.object({ filename: v.string(), content_type: v.string() })), v.minLength(1), v.maxLength(50)) });

export const presignUploadResponseSchema = PresignResponseSchema;

export const createBlockRequestSchema = v.intersect([BlockInputSchema, v.object({ channel_ids: ChannelIdsSchema, insert_at: v.optional(v.pipe(v.number(), v.integer())) })]);

export const createBlockResponseSchema = BlockSchema;

export const batchCreateBlocksRequestSchema = v.object({ channel_ids: ChannelIdsSchema, blocks: v.pipe(v.array(BlockInputSchema), v.minLength(1), v.maxLength(50)) });

export const batchCreateBlocksResponseSchema = BatchResponseSchema;

export const getBatchStatusResponseSchema = BatchStatusSchema;

export const getBlockResponseSchema = BlockSchema;

export const updateBlockRequestSchema = v.object({ title: v.optional(v.string()), description: v.optional(v.string()), content: v.optional(v.string()), alt_text: v.optional(v.string()) });

export const updateBlockResponseSchema = BlockSchema;

export const getBlockConnectionsResponseSchema = ChannelListResponseSchema;

export const getBlockCommentsResponseSchema = CommentListResponseSchema;

export const createBlockCommentRequestSchema = v.object({ body: v.string() });

export const createBlockCommentResponseSchema = CommentSchema;

export const createChannelRequestSchema = v.object({ title: v.string(), visibility: v.optional(ChannelVisibilitySchema), description: v.optional(v.string()), group_id: v.optional(v.pipe(v.number(), v.integer())) });

export const createChannelResponseSchema = ChannelSchema;

export const getChannelResponseSchema = ChannelSchema;

export const updateChannelRequestSchema = v.object({ title: v.optional(v.string()), visibility: v.optional(ChannelVisibilitySchema), description: v.optional(v.unknown()) });

export const updateChannelResponseSchema = ChannelSchema;

export const createConnectionRequestSchema = v.object({ connectable_id: v.pipe(v.number(), v.integer()), connectable_type: ConnectableTypeSchema, channel_ids: ChannelIdsSchema, position: v.optional(v.pipe(v.number(), v.integer())) });

export const createConnectionResponseSchema = v.object({ data: v.optional(v.array(ConnectionSchema)) });

export const getConnectionResponseSchema = ConnectionSchema;

export const moveConnectionRequestSchema = v.object({ movement: v.optional(MovementSchema), position: v.optional(v.pipe(v.number(), v.integer())) });

export const moveConnectionResponseSchema = ConnectionSchema;

export const getChannelContentsResponseSchema = ConnectableListResponseSchema;

export const getChannelConnectionsResponseSchema = ChannelListResponseSchema;

export const getChannelFollowersResponseSchema = UserListResponseSchema;

export const getCurrentUserResponseSchema = UserSchema;

export const getUserResponseSchema = UserSchema;

export const getUserContentsResponseSchema = ConnectableListResponseSchema;

export const getUserFollowersResponseSchema = UserListResponseSchema;

export const getUserFollowingResponseSchema = FollowableListResponseSchema;

export const getGroupResponseSchema = GroupSchema;

export const getGroupContentsResponseSchema = ConnectableListResponseSchema;

export const getGroupFollowersResponseSchema = UserListResponseSchema;

export const searchResponseSchema = EverythingListResponseSchema;
