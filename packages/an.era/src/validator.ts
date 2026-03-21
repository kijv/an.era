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

export const CommentSchema = v.object({ id: v.pipe(v.number(), v.integer()), type: v.literal("Comment"), body: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), user: EmbeddedUserSchema, _links: v.intersect([LinksSchema, v.unknown()]) });

export const ChannelOwnerSchema = v.union([EmbeddedUserSchema, EmbeddedGroupSchema]);

export const ChannelCountsSchema = v.object({ blocks: v.pipe(v.number(), v.integer()), channels: v.pipe(v.number(), v.integer()), contents: v.pipe(v.number(), v.integer()), collaborators: v.pipe(v.number(), v.integer()) });

export const ChannelCollaboratorSchema = v.union([EmbeddedUserSchema, EmbeddedGroupSchema]);

export const ChannelAbilitiesSchema = v.object({ add_to: v.boolean(), update: v.boolean(), destroy: v.boolean(), manage_collaborators: v.boolean() });

export const ChannelSchema = v.object({ id: v.pipe(v.number(), v.integer()), type: v.literal("Channel"), slug: v.string(), title: v.string(), description: v.optional(v.nullable(v.union([MarkdownContentSchema, v.null()]))), state: ChannelStateSchema, visibility: ChannelVisibilitySchema, created_at: v.pipe(v.string(), v.isoTimestamp()), updated_at: v.pipe(v.string(), v.isoTimestamp()), owner: ChannelOwnerSchema, counts: ChannelCountsSchema, collaborators: v.optional(v.array(ChannelCollaboratorSchema)), _links: v.intersect([LinksSchema, v.unknown()]), connection: v.optional(v.nullable(v.union([EmbeddedConnectionSchema, v.null()]))), can: v.optional(v.nullable(v.union([ChannelAbilitiesSchema, v.null()]))) });

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

export const createOAuthToken200ResponseSchema = v.object({ access_token: v.string(), token_type: v.literal("Bearer"), scope: v.string(), created_at: v.pipe(v.number(), v.integer()) });

export const createOAuthToken400ResponseSchema = v.object({ error: v.optional(v.picklist(["invalid_request", "invalid_client", "invalid_grant", "unauthorized_client", "unsupported_grant_type"])), error_description: v.optional(v.string()) });

export const createOAuthToken401ResponseSchema = v.object({ error: v.optional(v.string()), error_description: v.optional(v.string()) });

export const getOpenapiSpec200ResponseSchema = v.string();

export const getOpenapiSpec404ResponseSchema = ErrorSchema;

export const getOpenapiSpecJson200ResponseSchema = v.object({  });

export const getOpenapiSpecJson404ResponseSchema = ErrorSchema;

export const getPing200ResponseSchema = PingResponseSchema;

export const getPing429ResponseSchema = RateLimitErrorSchema;

export const presignUploadRequestSchema = v.object({ files: v.pipe(v.array(v.object({ filename: v.string(), content_type: v.string() })), v.minLength(1), v.maxLength(50)) });

export const presignUpload201ResponseSchema = PresignResponseSchema;

export const presignUpload400ResponseSchema = ErrorSchema;

export const presignUpload401ResponseSchema = ErrorSchema;

export const presignUpload429ResponseSchema = RateLimitErrorSchema;

export const createBlockRequestSchema = v.intersect([BlockInputSchema, v.object({ channel_ids: ChannelIdsSchema, insert_at: v.optional(v.pipe(v.number(), v.integer())) })]);

export const createBlock201ResponseSchema = BlockSchema;

export const createBlock400ResponseSchema = ErrorSchema;

export const createBlock401ResponseSchema = ErrorSchema;

export const createBlock403ResponseSchema = ErrorSchema;

export const createBlock404ResponseSchema = ErrorSchema;

export const createBlock429ResponseSchema = RateLimitErrorSchema;

export const batchCreateBlocksRequestSchema = v.object({ channel_ids: ChannelIdsSchema, blocks: v.pipe(v.array(BlockInputSchema), v.minLength(1), v.maxLength(50)) });

export const batchCreateBlocks202ResponseSchema = BatchResponseSchema;

export const batchCreateBlocks400ResponseSchema = ErrorSchema;

export const batchCreateBlocks401ResponseSchema = ErrorSchema;

export const batchCreateBlocks403ResponseSchema = ErrorSchema;

export const batchCreateBlocks404ResponseSchema = ErrorSchema;

export const batchCreateBlocks422ResponseSchema = ErrorSchema;

export const batchCreateBlocks429ResponseSchema = RateLimitErrorSchema;

export const getBatchStatus200ResponseSchema = BatchStatusSchema;

export const getBatchStatus401ResponseSchema = ErrorSchema;

export const getBatchStatus403ResponseSchema = ErrorSchema;

export const getBatchStatus404ResponseSchema = ErrorSchema;

export const getBatchStatus429ResponseSchema = RateLimitErrorSchema;

export const getBlock200ResponseSchema = BlockSchema;

export const getBlock401ResponseSchema = ErrorSchema;

export const getBlock403ResponseSchema = ErrorSchema;

export const getBlock404ResponseSchema = ErrorSchema;

export const getBlock429ResponseSchema = RateLimitErrorSchema;

export const updateBlockRequestSchema = v.object({ title: v.optional(v.string()), description: v.optional(v.string()), content: v.optional(v.string()), alt_text: v.optional(v.string()) });

export const updateBlock200ResponseSchema = BlockSchema;

export const updateBlock400ResponseSchema = ErrorSchema;

export const updateBlock401ResponseSchema = ErrorSchema;

export const updateBlock403ResponseSchema = ErrorSchema;

export const updateBlock404ResponseSchema = ErrorSchema;

export const updateBlock422ResponseSchema = ErrorSchema;

export const updateBlock429ResponseSchema = RateLimitErrorSchema;

export const getBlockConnections200ResponseSchema = ChannelListResponseSchema;

export const getBlockConnections401ResponseSchema = ErrorSchema;

export const getBlockConnections403ResponseSchema = ErrorSchema;

export const getBlockConnections404ResponseSchema = ErrorSchema;

export const getBlockConnections429ResponseSchema = RateLimitErrorSchema;

export const getBlockComments200ResponseSchema = CommentListResponseSchema;

export const getBlockComments401ResponseSchema = ErrorSchema;

export const getBlockComments403ResponseSchema = ErrorSchema;

export const getBlockComments404ResponseSchema = ErrorSchema;

export const getBlockComments429ResponseSchema = RateLimitErrorSchema;

export const createBlockCommentRequestSchema = v.object({ body: v.string() });

export const createBlockComment201ResponseSchema = CommentSchema;

export const createBlockComment400ResponseSchema = ErrorSchema;

export const createBlockComment401ResponseSchema = ErrorSchema;

export const createBlockComment403ResponseSchema = ErrorSchema;

export const createBlockComment404ResponseSchema = ErrorSchema;

export const createBlockComment422ResponseSchema = ErrorSchema;

export const createBlockComment429ResponseSchema = RateLimitErrorSchema;

export const deleteComment401ResponseSchema = ErrorSchema;

export const deleteComment403ResponseSchema = ErrorSchema;

export const deleteComment404ResponseSchema = ErrorSchema;

export const deleteComment429ResponseSchema = RateLimitErrorSchema;

export const createChannelRequestSchema = v.object({ title: v.string(), visibility: v.optional(ChannelVisibilitySchema), description: v.optional(v.string()), group_id: v.optional(v.pipe(v.number(), v.integer())) });

export const createChannel201ResponseSchema = ChannelSchema;

export const createChannel400ResponseSchema = ErrorSchema;

export const createChannel401ResponseSchema = ErrorSchema;

export const createChannel403ResponseSchema = ErrorSchema;

export const createChannel422ResponseSchema = ErrorSchema;

export const createChannel429ResponseSchema = RateLimitErrorSchema;

export const getChannel200ResponseSchema = ChannelSchema;

export const getChannel401ResponseSchema = ErrorSchema;

export const getChannel403ResponseSchema = ErrorSchema;

export const getChannel404ResponseSchema = ErrorSchema;

export const getChannel429ResponseSchema = RateLimitErrorSchema;

export const updateChannelRequestSchema = v.object({ title: v.optional(v.string()), visibility: v.optional(ChannelVisibilitySchema), description: v.optional(v.unknown()) });

export const updateChannel200ResponseSchema = ChannelSchema;

export const updateChannel400ResponseSchema = ErrorSchema;

export const updateChannel401ResponseSchema = ErrorSchema;

export const updateChannel403ResponseSchema = ErrorSchema;

export const updateChannel404ResponseSchema = ErrorSchema;

export const updateChannel422ResponseSchema = ErrorSchema;

export const updateChannel429ResponseSchema = RateLimitErrorSchema;

export const deleteChannel401ResponseSchema = ErrorSchema;

export const deleteChannel403ResponseSchema = ErrorSchema;

export const deleteChannel404ResponseSchema = ErrorSchema;

export const deleteChannel429ResponseSchema = RateLimitErrorSchema;

export const createConnectionRequestSchema = v.object({ connectable_id: v.pipe(v.number(), v.integer()), connectable_type: ConnectableTypeSchema, channel_ids: ChannelIdsSchema, position: v.optional(v.pipe(v.number(), v.integer())) });

export const createConnection201ResponseSchema = v.object({ data: v.optional(v.array(ConnectionSchema)) });

export const createConnection400ResponseSchema = ErrorSchema;

export const createConnection401ResponseSchema = ErrorSchema;

export const createConnection403ResponseSchema = ErrorSchema;

export const createConnection404ResponseSchema = ErrorSchema;

export const createConnection422ResponseSchema = ErrorSchema;

export const createConnection429ResponseSchema = RateLimitErrorSchema;

export const getConnection200ResponseSchema = ConnectionSchema;

export const getConnection401ResponseSchema = ErrorSchema;

export const getConnection403ResponseSchema = ErrorSchema;

export const getConnection404ResponseSchema = ErrorSchema;

export const getConnection429ResponseSchema = RateLimitErrorSchema;

export const deleteConnection401ResponseSchema = ErrorSchema;

export const deleteConnection403ResponseSchema = ErrorSchema;

export const deleteConnection404ResponseSchema = ErrorSchema;

export const deleteConnection429ResponseSchema = RateLimitErrorSchema;

export const moveConnectionRequestSchema = v.object({ movement: v.optional(MovementSchema), position: v.optional(v.pipe(v.number(), v.integer())) });

export const moveConnection200ResponseSchema = ConnectionSchema;

export const moveConnection400ResponseSchema = ErrorSchema;

export const moveConnection401ResponseSchema = ErrorSchema;

export const moveConnection403ResponseSchema = ErrorSchema;

export const moveConnection404ResponseSchema = ErrorSchema;

export const moveConnection422ResponseSchema = ErrorSchema;

export const moveConnection429ResponseSchema = RateLimitErrorSchema;

export const getChannelContents200ResponseSchema = ConnectableListResponseSchema;

export const getChannelContents401ResponseSchema = ErrorSchema;

export const getChannelContents403ResponseSchema = ErrorSchema;

export const getChannelContents404ResponseSchema = ErrorSchema;

export const getChannelContents429ResponseSchema = RateLimitErrorSchema;

export const getChannelConnections200ResponseSchema = ChannelListResponseSchema;

export const getChannelConnections401ResponseSchema = ErrorSchema;

export const getChannelConnections403ResponseSchema = ErrorSchema;

export const getChannelConnections404ResponseSchema = ErrorSchema;

export const getChannelConnections429ResponseSchema = RateLimitErrorSchema;

export const getChannelFollowers200ResponseSchema = UserListResponseSchema;

export const getChannelFollowers401ResponseSchema = ErrorSchema;

export const getChannelFollowers403ResponseSchema = ErrorSchema;

export const getChannelFollowers404ResponseSchema = ErrorSchema;

export const getChannelFollowers429ResponseSchema = RateLimitErrorSchema;

export const getCurrentUser200ResponseSchema = UserSchema;

export const getCurrentUser401ResponseSchema = ErrorSchema;

export const getCurrentUser429ResponseSchema = RateLimitErrorSchema;

export const getUser200ResponseSchema = UserSchema;

export const getUser401ResponseSchema = ErrorSchema;

export const getUser403ResponseSchema = ErrorSchema;

export const getUser404ResponseSchema = ErrorSchema;

export const getUser429ResponseSchema = RateLimitErrorSchema;

export const getUserContents200ResponseSchema = ConnectableListResponseSchema;

export const getUserContents401ResponseSchema = ErrorSchema;

export const getUserContents403ResponseSchema = ErrorSchema;

export const getUserContents404ResponseSchema = ErrorSchema;

export const getUserContents429ResponseSchema = RateLimitErrorSchema;

export const getUserFollowers200ResponseSchema = UserListResponseSchema;

export const getUserFollowers401ResponseSchema = ErrorSchema;

export const getUserFollowers403ResponseSchema = ErrorSchema;

export const getUserFollowers404ResponseSchema = ErrorSchema;

export const getUserFollowers429ResponseSchema = RateLimitErrorSchema;

export const getUserFollowing200ResponseSchema = FollowableListResponseSchema;

export const getUserFollowing401ResponseSchema = ErrorSchema;

export const getUserFollowing403ResponseSchema = ErrorSchema;

export const getUserFollowing404ResponseSchema = ErrorSchema;

export const getUserFollowing429ResponseSchema = RateLimitErrorSchema;

export const getGroup200ResponseSchema = GroupSchema;

export const getGroup401ResponseSchema = ErrorSchema;

export const getGroup403ResponseSchema = ErrorSchema;

export const getGroup404ResponseSchema = ErrorSchema;

export const getGroup429ResponseSchema = RateLimitErrorSchema;

export const getGroupContents200ResponseSchema = ConnectableListResponseSchema;

export const getGroupContents401ResponseSchema = ErrorSchema;

export const getGroupContents403ResponseSchema = ErrorSchema;

export const getGroupContents404ResponseSchema = ErrorSchema;

export const getGroupContents429ResponseSchema = RateLimitErrorSchema;

export const getGroupFollowers200ResponseSchema = UserListResponseSchema;

export const getGroupFollowers401ResponseSchema = ErrorSchema;

export const getGroupFollowers403ResponseSchema = ErrorSchema;

export const getGroupFollowers404ResponseSchema = ErrorSchema;

export const getGroupFollowers429ResponseSchema = RateLimitErrorSchema;

export const search200ResponseSchema = EverythingListResponseSchema;

export const search400ResponseSchema = ErrorSchema;

export const search401ResponseSchema = ErrorSchema;

export const search403ResponseSchema = ErrorSchema;

export const search429ResponseSchema = RateLimitErrorSchema;

// Types inferred from schemas

export type Error = v.InferInput<typeof ErrorSchema>;
export type UserTier = v.InferInput<typeof UserTierSchema>;
export type RateLimitError = v.InferInput<typeof RateLimitErrorSchema>;
export type Link = v.InferInput<typeof LinkSchema>;
export type Links = v.InferInput<typeof LinksSchema>;
export type MarkdownContent = v.InferInput<typeof MarkdownContentSchema>;
export type EmbeddedUser = v.InferInput<typeof EmbeddedUserSchema>;
export type EmbeddedConnection = v.InferInput<typeof EmbeddedConnectionSchema>;
export type ConnectionAbilities = v.InferInput<typeof ConnectionAbilitiesSchema>;
export type Connection = v.InferInput<typeof ConnectionSchema>;
export type EmbeddedGroup = v.InferInput<typeof EmbeddedGroupSchema>;
export type UserBadge = v.InferInput<typeof UserBadgeSchema>;
export type UserCounts = v.InferInput<typeof UserCountsSchema>;
export type User = v.InferInput<typeof UserSchema>;
export type GroupCounts = v.InferInput<typeof GroupCountsSchema>;
export type Group = v.InferInput<typeof GroupSchema>;
export type BlockState = v.InferInput<typeof BlockStateSchema>;
export type BlockVisibility = v.InferInput<typeof BlockVisibilitySchema>;
export type ChannelState = v.InferInput<typeof ChannelStateSchema>;
export type ConnectionFilter = v.InferInput<typeof ConnectionFilterSchema>;
export type FollowableType = v.InferInput<typeof FollowableTypeSchema>;
export type ConnectableType = v.InferInput<typeof ConnectableTypeSchema>;
export type ContentTypeFilter = v.InferInput<typeof ContentTypeFilterSchema>;
export type SearchTypeFilter = v.InferInput<typeof SearchTypeFilterSchema>;
export type FileExtension = v.InferInput<typeof FileExtensionSchema>;
export type ConnectionSort = v.InferInput<typeof ConnectionSortSchema>;
export type ChannelContentSort = v.InferInput<typeof ChannelContentSortSchema>;
export type ContentSort = v.InferInput<typeof ContentSortSchema>;
export type SearchScope = v.InferInput<typeof SearchScopeSchema>;
export type SearchSort = v.InferInput<typeof SearchSortSchema>;
export type ChannelVisibility = v.InferInput<typeof ChannelVisibilitySchema>;
export type Movement = v.InferInput<typeof MovementSchema>;
export type ChannelIds = v.InferInput<typeof ChannelIdsSchema>;
export type PresignedFile = v.InferInput<typeof PresignedFileSchema>;
export type PresignResponse = v.InferInput<typeof PresignResponseSchema>;
export type BlockInput = v.InferInput<typeof BlockInputSchema>;
export type BatchResponse = v.InferInput<typeof BatchResponseSchema>;
export type BatchStatus = v.InferInput<typeof BatchStatusSchema>;
export type BlockProvider = v.InferInput<typeof BlockProviderSchema>;
export type BlockSource = v.InferInput<typeof BlockSourceSchema>;
export type BlockAbilities = v.InferInput<typeof BlockAbilitiesSchema>;
export type BaseBlockProperties = v.InferInput<typeof BaseBlockPropertiesSchema>;
export type TextBlock = v.InferInput<typeof TextBlockSchema>;
export type ImageVersion = v.InferInput<typeof ImageVersionSchema>;
export type BlockImage = v.InferInput<typeof BlockImageSchema>;
export type ImageBlock = v.InferInput<typeof ImageBlockSchema>;
export type LinkBlock = v.InferInput<typeof LinkBlockSchema>;
export type BlockAttachment = v.InferInput<typeof BlockAttachmentSchema>;
export type AttachmentBlock = v.InferInput<typeof AttachmentBlockSchema>;
export type BlockEmbed = v.InferInput<typeof BlockEmbedSchema>;
export type EmbedBlock = v.InferInput<typeof EmbedBlockSchema>;
export type PendingBlock = v.InferInput<typeof PendingBlockSchema>;
export type Block = v.InferInput<typeof BlockSchema>;
export type Comment = v.InferInput<typeof CommentSchema>;
export type ChannelOwner = v.InferInput<typeof ChannelOwnerSchema>;
export type ChannelCounts = v.InferInput<typeof ChannelCountsSchema>;
export type ChannelCollaborator = v.InferInput<typeof ChannelCollaboratorSchema>;
export type ChannelAbilities = v.InferInput<typeof ChannelAbilitiesSchema>;
export type Channel = v.InferInput<typeof ChannelSchema>;
export type PaginationMeta = v.InferInput<typeof PaginationMetaSchema>;
export type PaginatedResponse = v.InferInput<typeof PaginatedResponseSchema>;
export type UserList = v.InferInput<typeof UserListSchema>;
export type ChannelList = v.InferInput<typeof ChannelListSchema>;
export type ConnectableList = v.InferInput<typeof ConnectableListSchema>;
export type FollowableList = v.InferInput<typeof FollowableListSchema>;
export type EverythingList = v.InferInput<typeof EverythingListSchema>;
export type UserListResponse = v.InferInput<typeof UserListResponseSchema>;
export type ChannelListResponse = v.InferInput<typeof ChannelListResponseSchema>;
export type ConnectableListResponse = v.InferInput<typeof ConnectableListResponseSchema>;
export type FollowableListResponse = v.InferInput<typeof FollowableListResponseSchema>;
export type EverythingListResponse = v.InferInput<typeof EverythingListResponseSchema>;
export type CommentList = v.InferInput<typeof CommentListSchema>;
export type CommentListResponse = v.InferInput<typeof CommentListResponseSchema>;
export type PingResponse = v.InferInput<typeof PingResponseSchema>;