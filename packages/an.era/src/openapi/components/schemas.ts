import * as v from "valibot";
export const ErrorSchema = v.object({ "error": v.string(), "code": v.pipe(v.number(), v.integer()), "details": v.optional(v.object({ "message": v.optional(v.string()) })) });
type Error = { error: string, code: number, details?: { message?: string } };
export const RateLimitErrorSchema = v.object({ "error": v.object({ "type": v.string(), "message": v.string(), "tier": v.picklist(["guest", "free", "premium", "supporter"]), "limit": v.pipe(v.number(), v.integer()), "limit_window": v.optional(v.string()), "retry_after": v.pipe(v.number(), v.integer()), "current_status": v.optional(v.object({ "tier": v.optional(v.string()), "limits": v.optional(v.object({})), "upgrade_path": v.optional(v.object({ "current": v.optional(v.string()), "recommended": v.optional(v.string()), "benefits": v.optional(v.array(v.string())), "action": v.optional(v.string()) })) })), "suggestions": v.array(v.string()), "headers_note": v.optional(v.string()) }) });
type RateLimitError = { error: { type: string, message: string, tier: "guest" | "free" | "premium" | "supporter", limit: number, limit_window?: string, retry_after: number, current_status?: { tier?: string, limits?: {}, upgrade_path?: { current?: string, recommended?: string, benefits?: string[], action?: string } }, suggestions: string[], headers_note?: string } };
export const LinkSchema = v.object({ "href": v.pipe(v.string(), v.url()) });
type Link = { href: string };
export const MarkdownContentSchema = v.object({ "markdown": v.string(), "html": v.string(), "plain": v.string() });
type MarkdownContent = { markdown: string, html: string, plain: string };
export const EmbeddedUserSchema = v.object({ "id": v.pipe(v.number(), v.integer()), "type": v.literal("User"), "name": v.string(), "slug": v.string(), "avatar": v.union([v.pipe(v.string(), v.url()), v.null_()]), "initials": v.string() });
type EmbeddedUser = { id: number, type: "User", name: string, slug: string, avatar: string | null, initials: string };
export const ConnectionAbilitiesSchema = v.object({ "remove": v.boolean() });
type ConnectionAbilities = { remove: boolean };
export const EmbeddedGroupSchema = v.object({ "id": v.pipe(v.number(), v.integer()), "type": v.literal("Group"), "name": v.string(), "slug": v.string(), "avatar": v.union([v.pipe(v.string(), v.url()), v.null_()]), "initials": v.string() });
type EmbeddedGroup = { id: number, type: "Group", name: string, slug: string, avatar: string | null, initials: string };
export const UserCountsSchema = v.object({ "channels": v.pipe(v.number(), v.integer()), "followers": v.pipe(v.number(), v.integer()), "following": v.pipe(v.number(), v.integer()) });
type UserCounts = { channels: number, followers: number, following: number };
export const GroupCountsSchema = v.object({ "channels": v.pipe(v.number(), v.integer()), "users": v.pipe(v.number(), v.integer()) });
type GroupCounts = { channels: number, users: number };
export const ContentTypeFilterSchema = v.picklist(["Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block"]);
type ContentTypeFilter = "Text" | "Image" | "Link" | "Attachment" | "Embed" | "Channel" | "Block";
export const SearchTypeFilterSchema = v.picklist(["All", "Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block", "User", "Group"]);
type SearchTypeFilter = "All" | "Text" | "Image" | "Link" | "Attachment" | "Embed" | "Channel" | "Block" | "User" | "Group";
export const FileExtensionSchema = v.picklist(["aac", "ai", "aiff", "avi", "avif", "bmp", "csv", "doc", "docx", "eps", "epub", "fla", "gif", "h264", "heic", "heif", "ind", "indd", "jpeg", "jpg", "key", "kml", "kmz", "latex", "m4a", "ma", "mb", "mid", "midi", "mov", "mp3", "mp4", "mp4v", "mpeg", "mpg", "mpg4", "numbers", "oga", "ogg", "ogv", "otf", "pages", "pdf", "pgp", "png", "ppt", "pptx", "psd", "svg", "swa", "swf", "tex", "texi", "texinfo", "tfm", "tif", "tiff", "torrent", "ttc", "ttf", "txt", "wav", "webm", "webp", "wma", "xls", "xlsx", "xlt"]);
type FileExtension = "aac" | "ai" | "aiff" | "avi" | "avif" | "bmp" | "csv" | "doc" | "docx" | "eps" | "epub" | "fla" | "gif" | "h264" | "heic" | "heif" | "ind" | "indd" | "jpeg" | "jpg" | "key" | "kml" | "kmz" | "latex" | "m4a" | "ma" | "mb" | "mid" | "midi" | "mov" | "mp3" | "mp4" | "mp4v" | "mpeg" | "mpg" | "mpg4" | "numbers" | "oga" | "ogg" | "ogv" | "otf" | "pages" | "pdf" | "pgp" | "png" | "ppt" | "pptx" | "psd" | "svg" | "swa" | "swf" | "tex" | "texi" | "texinfo" | "tfm" | "tif" | "tiff" | "torrent" | "ttc" | "ttf" | "txt" | "wav" | "webm" | "webp" | "wma" | "xls" | "xlsx" | "xlt";
export const ConnectionSortSchema = v.picklist(["created_at_desc", "created_at_asc"]);
type ConnectionSort = "created_at_desc" | "created_at_asc";
export const ChannelContentSortSchema = v.picklist(["position_asc", "position_desc", "created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"]);
type ChannelContentSort = "position_asc" | "position_desc" | "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc";
export const ContentSortSchema = v.picklist(["created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"]);
type ContentSort = "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc";
export const ChannelVisibilitySchema = v.picklist(["public", "private", "closed"]);
type ChannelVisibility = "public" | "private" | "closed";
export const BlockAbilitiesSchema = v.object({ "manage": v.boolean(), "comment": v.boolean(), "connect": v.boolean() });
type BlockAbilities = { manage: boolean, comment: boolean, connect: boolean };
export const BlockProviderSchema = v.object({ "name": v.string(), "url": v.pipe(v.string(), v.url()) });
type BlockProvider = { name: string, url: string };
export const ImageVersionSchema = v.object({ "src": v.pipe(v.string(), v.url()), "src_2x": v.pipe(v.string(), v.url()), "width": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "height": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])) });
type ImageVersion = { src: string, src_2x: string, width?: number | null, height?: number | null };
export const BlockEmbedSchema = v.object({ "url": v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])), "type": v.optional(v.union([v.string(), v.null_()])), "title": v.optional(v.union([v.string(), v.null_()])), "author_name": v.optional(v.union([v.string(), v.null_()])), "author_url": v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])), "source_url": v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])), "width": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "height": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "html": v.optional(v.union([v.string(), v.null_()])), "thumbnail_url": v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])) });
type BlockEmbed = { url?: string | null, type?: string | null, title?: string | null, author_name?: string | null, author_url?: string | null, source_url?: string | null, width?: number | null, height?: number | null, html?: string | null, thumbnail_url?: string | null };
export const BlockAttachmentSchema = v.object({ "filename": v.optional(v.union([v.string(), v.null_()])), "content_type": v.optional(v.union([v.string(), v.null_()])), "file_size": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "file_extension": v.optional(v.union([v.string(), v.null_()])), "updated_at": v.optional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.null_()])), "url": v.pipe(v.string(), v.url()) });
type BlockAttachment = { filename?: string | null, content_type?: string | null, file_size?: number | null, file_extension?: string | null, updated_at?: string | null, url: string };
export const ChannelAbilitiesSchema = v.object({ "add_to": v.boolean(), "update": v.boolean(), "destroy": v.boolean(), "manage_collaborators": v.boolean() });
type ChannelAbilities = { add_to: boolean, update: boolean, destroy: boolean, manage_collaborators: boolean };
export const ChannelCountsSchema = v.object({ "blocks": v.pipe(v.number(), v.integer()), "channels": v.pipe(v.number(), v.integer()), "contents": v.pipe(v.number(), v.integer()), "collaborators": v.pipe(v.number(), v.integer()) });
type ChannelCounts = { blocks: number, channels: number, contents: number, collaborators: number };
export const PaginationMetaSchema = v.object({ "current_page": v.pipe(v.number(), v.integer()), "next_page": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "prev_page": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "per_page": v.pipe(v.number(), v.integer()), "total_pages": v.pipe(v.number(), v.integer()), "total_count": v.pipe(v.number(), v.integer()), "has_more_pages": v.boolean() });
type PaginationMeta = { current_page: number, next_page?: number | null, prev_page?: number | null, per_page: number, total_pages: number, total_count: number, has_more_pages: boolean };
export const PingResponseSchema = v.object({ "status": v.literal("ok") });
type PingResponse = { status: "ok" };
export const LinksSchema = v.objectWithRest({ "self": LinkSchema }, LinkSchema);
type Links = { self: Link };
export const EmbeddedConnectionSchema = v.object({ "id": v.pipe(v.number(), v.integer()), "position": v.pipe(v.number(), v.integer()), "pinned": v.boolean(), "connected_at": v.pipe(v.string(), v.isoTimestamp()), "connected_by": v.union([EmbeddedUserSchema, v.null_()]) });
type EmbeddedConnection = { id: number, position: number, pinned: boolean, connected_at: string, connected_by: EmbeddedUser | null };
export const ChannelOwnerSchema = v.union([EmbeddedUserSchema, EmbeddedGroupSchema]);
type ChannelOwner = EmbeddedUser | EmbeddedGroup;
export const BlockSourceSchema = v.object({ "url": v.pipe(v.string(), v.url()), "title": v.optional(v.union([v.string(), v.null_()])), "provider": v.optional(v.union([BlockProviderSchema, v.null_()])) });
type BlockSource = { url: string, title?: string | null, provider?: BlockProvider | null };
export const BlockImageSchema = v.object({ "alt_text": v.optional(v.union([v.string(), v.null_()])), "blurhash": v.optional(v.union([v.string(), v.null_()])), "width": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "height": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "aspect_ratio": v.optional(v.union([v.number(), v.null_()])), "content_type": v.optional(v.string()), "filename": v.optional(v.string()), "file_size": v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])), "updated_at": v.optional(v.pipe(v.string(), v.isoTimestamp())), "small": ImageVersionSchema, "medium": ImageVersionSchema, "large": ImageVersionSchema, "square": ImageVersionSchema });
type BlockImage = { alt_text?: string | null, blurhash?: string | null, width?: number | null, height?: number | null, aspect_ratio?: number | null, content_type?: string, filename?: string, file_size?: number | null, updated_at?: string, small: ImageVersion, medium: ImageVersion, large: ImageVersion, square: ImageVersion };
export const PaginatedResponseSchema = v.object({ "meta": PaginationMetaSchema });
type PaginatedResponse = { meta: PaginationMeta };
export const UserSchema = v.intersect([EmbeddedUserSchema, v.object({ "created_at": v.pipe(v.string(), v.isoTimestamp()), "updated_at": v.pipe(v.string(), v.isoTimestamp()), "bio": v.optional(v.union([MarkdownContentSchema, v.null_()])), "counts": UserCountsSchema, "_links": LinksSchema })]);
type User = EmbeddedUser & { created_at: string, updated_at: string, bio?: MarkdownContent | null, counts: UserCounts, _links: Links };
export const GroupSchema = v.intersect([EmbeddedGroupSchema, v.object({ "bio": v.optional(v.union([MarkdownContentSchema, v.null_()])), "created_at": v.pipe(v.string(), v.isoTimestamp()), "updated_at": v.pipe(v.string(), v.isoTimestamp()), "user": EmbeddedUserSchema, "counts": GroupCountsSchema, "_links": LinksSchema })]);
type Group = EmbeddedGroup & { bio?: MarkdownContent | null, created_at: string, updated_at: string, user: EmbeddedUser, counts: GroupCounts, _links: Links };
export const CommentSchema = v.object({ "id": v.pipe(v.number(), v.integer()), "type": v.literal("Comment"), "body": v.optional(v.union([MarkdownContentSchema, v.null_()])), "created_at": v.pipe(v.string(), v.isoTimestamp()), "updated_at": v.pipe(v.string(), v.isoTimestamp()), "user": EmbeddedUserSchema, "_links": LinksSchema });
type Comment = { id: number, type: "Comment", body?: MarkdownContent | null, created_at: string, updated_at: string, user: EmbeddedUser, _links: Links };
export const ConnectionSchema = v.intersect([EmbeddedConnectionSchema, v.object({ "can": ConnectionAbilitiesSchema, "_links": LinksSchema })]);
type Connection = EmbeddedConnection & { can: ConnectionAbilities, _links: Links };
export const ChannelSchema = v.object({ "id": v.pipe(v.number(), v.integer()), "type": v.literal("Channel"), "slug": v.string(), "title": v.string(), "description": v.optional(v.union([MarkdownContentSchema, v.null_()])), "state": v.picklist(["available", "deleted"]), "visibility": ChannelVisibilitySchema, "created_at": v.pipe(v.string(), v.isoTimestamp()), "updated_at": v.pipe(v.string(), v.isoTimestamp()), "owner": ChannelOwnerSchema, "counts": ChannelCountsSchema, "_links": LinksSchema, "connection": v.optional(v.union([EmbeddedConnectionSchema, v.null_()])), "can": v.optional(v.union([ChannelAbilitiesSchema, v.null_()])) });
type Channel = { id: number, type: "Channel", slug: string, title: string, description?: MarkdownContent | null, state: "available" | "deleted", visibility: ChannelVisibility, created_at: string, updated_at: string, owner: ChannelOwner, counts: ChannelCounts, _links: Links, connection?: EmbeddedConnection | null, can?: ChannelAbilities | null };
export const BaseBlockPropertiesSchema = v.object({ "id": v.pipe(v.number(), v.integer()), "base_type": v.literal("Block"), "title": v.optional(v.union([v.string(), v.null_()])), "description": v.optional(v.union([MarkdownContentSchema, v.null_()])), "state": v.picklist(["processing", "available", "failed"]), "visibility": v.picklist(["public", "private", "orphan"]), "comment_count": v.pipe(v.number(), v.integer()), "created_at": v.pipe(v.string(), v.isoTimestamp()), "updated_at": v.pipe(v.string(), v.isoTimestamp()), "user": EmbeddedUserSchema, "source": v.optional(v.union([BlockSourceSchema, v.null_()])), "_links": LinksSchema, "connection": v.optional(v.union([EmbeddedConnectionSchema, v.null_()])), "can": v.optional(v.union([BlockAbilitiesSchema, v.null_()])) });
type BaseBlockProperties = { id: number, base_type: "Block", title?: string | null, description?: MarkdownContent | null, state: "processing" | "available" | "failed", visibility: "public" | "private" | "orphan", comment_count: number, created_at: string, updated_at: string, user: EmbeddedUser, source?: BlockSource | null, _links: Links, connection?: EmbeddedConnection | null, can?: BlockAbilities | null };
export const UserListSchema = v.object({ "data": v.array(UserSchema) });
type UserList = { data: User[] };
export const CommentListSchema = v.object({ "data": v.array(CommentSchema) });
type CommentList = { data: Comment[] };
export const ChannelListSchema = v.object({ "data": v.array(ChannelSchema) });
type ChannelList = { data: Channel[] };
export const FollowableListSchema = v.object({ "data": v.array(v.union([UserSchema, ChannelSchema, GroupSchema])) });
type FollowableList = { data: User | Channel | Group[] };
export const TextBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ "type": v.literal("Text"), "content": MarkdownContentSchema })]);
type TextBlock = BaseBlockProperties & { type: "Text", content: MarkdownContent };
export const ImageBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ "type": v.literal("Image"), "image": BlockImageSchema })]);
type ImageBlock = BaseBlockProperties & { type: "Image", image: BlockImage };
export const LinkBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ "type": v.literal("Link"), "image": v.optional(v.union([BlockImageSchema, v.null_()])), "content": v.optional(v.union([MarkdownContentSchema, v.null_()])) })]);
type LinkBlock = BaseBlockProperties & { type: "Link", image?: BlockImage | null, content?: MarkdownContent | null };
export const AttachmentBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ "type": v.literal("Attachment"), "attachment": BlockAttachmentSchema, "image": v.optional(v.union([BlockImageSchema, v.null_()])) })]);
type AttachmentBlock = BaseBlockProperties & { type: "Attachment", attachment: BlockAttachment, image?: BlockImage | null };
export const EmbedBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ "type": v.literal("Embed"), "embed": BlockEmbedSchema, "image": v.optional(v.union([BlockImageSchema, v.null_()])) })]);
type EmbedBlock = BaseBlockProperties & { type: "Embed", embed: BlockEmbed, image?: BlockImage | null };
export const PendingBlockSchema = v.intersect([BaseBlockPropertiesSchema, v.object({ "type": v.literal("PendingBlock") })]);
type PendingBlock = BaseBlockProperties & { type: "PendingBlock" };
export const UserListResponseSchema = v.intersect([UserListSchema, PaginatedResponseSchema]);
type UserListResponse = UserList & PaginatedResponse;
export const CommentListResponseSchema = v.intersect([CommentListSchema, PaginatedResponseSchema]);
type CommentListResponse = CommentList & PaginatedResponse;
export const ChannelListResponseSchema = v.intersect([ChannelListSchema, PaginatedResponseSchema]);
type ChannelListResponse = ChannelList & PaginatedResponse;
export const FollowableListResponseSchema = v.intersect([FollowableListSchema, PaginatedResponseSchema]);
type FollowableListResponse = FollowableList & PaginatedResponse;
export const ConnectableListSchema = v.object({ "data": v.array(v.union([TextBlockSchema, ImageBlockSchema, LinkBlockSchema, AttachmentBlockSchema, EmbedBlockSchema, ChannelSchema])) });
type ConnectableList = { data: TextBlock | ImageBlock | LinkBlock | AttachmentBlock | EmbedBlock | Channel[] };
export const EverythingListSchema = v.object({ "data": v.array(v.union([TextBlockSchema, ImageBlockSchema, LinkBlockSchema, AttachmentBlockSchema, EmbedBlockSchema, ChannelSchema, UserSchema, GroupSchema])) });
type EverythingList = { data: TextBlock | ImageBlock | LinkBlock | AttachmentBlock | EmbedBlock | Channel | User | Group[] };
export const BlockSchema = v.union([TextBlockSchema, ImageBlockSchema, LinkBlockSchema, AttachmentBlockSchema, EmbedBlockSchema, PendingBlockSchema]);
type Block = TextBlock | ImageBlock | LinkBlock | AttachmentBlock | EmbedBlock | PendingBlock;
export const ConnectableListResponseSchema = v.intersect([ConnectableListSchema, PaginatedResponseSchema]);
type ConnectableListResponse = ConnectableList & PaginatedResponse;
export const EverythingListResponseSchema = v.intersect([EverythingListSchema, PaginatedResponseSchema]);
type EverythingListResponse = EverythingList & PaginatedResponse;
export default {
	ErrorSchema,
	RateLimitErrorSchema,
	LinkSchema,
	MarkdownContentSchema,
	EmbeddedUserSchema,
	ConnectionAbilitiesSchema,
	EmbeddedGroupSchema,
	UserCountsSchema,
	GroupCountsSchema,
	ContentTypeFilterSchema,
	SearchTypeFilterSchema,
	FileExtensionSchema,
	ConnectionSortSchema,
	ChannelContentSortSchema,
	ContentSortSchema,
	ChannelVisibilitySchema,
	BlockAbilitiesSchema,
	BlockProviderSchema,
	ImageVersionSchema,
	BlockEmbedSchema,
	BlockAttachmentSchema,
	ChannelAbilitiesSchema,
	ChannelCountsSchema,
	PaginationMetaSchema,
	PingResponseSchema,
	LinksSchema,
	EmbeddedConnectionSchema,
	ChannelOwnerSchema,
	BlockSourceSchema,
	BlockImageSchema,
	PaginatedResponseSchema,
	UserSchema,
	GroupSchema,
	CommentSchema,
	ConnectionSchema,
	ChannelSchema,
	BaseBlockPropertiesSchema,
	UserListSchema,
	CommentListSchema,
	ChannelListSchema,
	FollowableListSchema,
	TextBlockSchema,
	ImageBlockSchema,
	LinkBlockSchema,
	AttachmentBlockSchema,
	EmbedBlockSchema,
	PendingBlockSchema,
	UserListResponseSchema,
	CommentListResponseSchema,
	ChannelListResponseSchema,
	FollowableListResponseSchema,
	ConnectableListSchema,
	EverythingListSchema,
	BlockSchema,
	ConnectableListResponseSchema,
	EverythingListResponseSchema
};
export type {
	Error,
 	RateLimitError,
 	Link,
 	MarkdownContent,
 	EmbeddedUser,
 	ConnectionAbilities,
 	EmbeddedGroup,
 	UserCounts,
 	GroupCounts,
 	ContentTypeFilter,
 	SearchTypeFilter,
 	FileExtension,
 	ConnectionSort,
 	ChannelContentSort,
 	ContentSort,
 	ChannelVisibility,
 	BlockAbilities,
 	BlockProvider,
 	ImageVersion,
 	BlockEmbed,
 	BlockAttachment,
 	ChannelAbilities,
 	ChannelCounts,
 	PaginationMeta,
 	PingResponse,
 	Links,
 	EmbeddedConnection,
 	ChannelOwner,
 	BlockSource,
 	BlockImage,
 	PaginatedResponse,
 	User,
 	Group,
 	Comment,
 	Connection,
 	Channel,
 	BaseBlockProperties,
 	UserList,
 	CommentList,
 	ChannelList,
 	FollowableList,
 	TextBlock,
 	ImageBlock,
 	LinkBlock,
 	AttachmentBlock,
 	EmbedBlock,
 	PendingBlock,
 	UserListResponse,
 	CommentListResponse,
 	ChannelListResponse,
 	FollowableListResponse,
 	ConnectableList,
 	EverythingList,
 	Block,
 	ConnectableListResponse,
 	EverythingListResponse
};