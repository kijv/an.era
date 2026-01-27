import * as v from "valibot";

const ErrorSchema = v.object({
	error: v.string(),
	code: v.pipe(v.number(), v.integer()),
	details: v.object({
			message: v.string(),
	}),
})
type Error = v.InferInput<typeof ErrorSchema>;
const RateLimitErrorSchema = v.required(
	v.object({
		error: v.object({
				type: v.string(),
				message: v.string(),
				tier: v.picklist(["guest","free","premium","supporter"]),
				limit: v.pipe(v.number(), v.integer()),
				limit_window: v.string(),
				retry_after: v.pipe(v.number(), v.integer()),
				current_status: v.object({
						tier: v.string(),
						limits: v.record(v.string(), v.union([
								v.number(),
						])),
						upgrade_path: v.object({
								current: v.string(),
								recommended: v.string(),
								benefits: v.array(
										v.string()
								),
								action: v.string(),
						}),
				}),
				suggestions: v.array(
						v.string()
				),
				headers_note: v.string(),
		}),
	}),
	["error"]
)
type RateLimitError = v.InferInput<typeof RateLimitErrorSchema>;
const LinkSchema = v.required(
	v.object({
		href: v.string(),
	}),
	["href"]
)
type Link = v.InferInput<typeof LinkSchema>;
const MarkdownContentSchema = v.required(
	v.object({
		markdown: v.string(),
		html: v.string(),
		plain: v.string(),
	}),
	["markdown","html","plain"]
)
type MarkdownContent = v.InferInput<typeof MarkdownContentSchema>;
const EmbeddedUserSchema = v.required(
	v.object({
		id: v.pipe(v.number(), v.integer()),
		type: v.picklist(["User"]),
		name: v.string(),
		slug: v.string(),
		avatar: v.union([
				v.string(),
				v.null(), v.undefined(),
		]),
		initials: v.string(),
	}),
	["id","type","name","slug","avatar","initials"]
)
type EmbeddedUser = v.InferInput<typeof EmbeddedUserSchema>;
const EmbeddedGroupSchema = v.required(
	v.object({
		id: v.pipe(v.number(), v.integer()),
		type: v.picklist(["Group"]),
		name: v.string(),
		slug: v.string(),
		avatar: v.union([
				v.string(),
				v.null(), v.undefined(),
		]),
		initials: v.string(),
	}),
	["id","type","name","slug","avatar","initials"]
)
type EmbeddedGroup = v.InferInput<typeof EmbeddedGroupSchema>;
const UserCountsSchema = v.required(
	v.object({
		channels: v.pipe(v.number(), v.integer()),
		followers: v.pipe(v.number(), v.integer()),
		following: v.pipe(v.number(), v.integer()),
	}),
	["channels","followers","following"]
)
type UserCounts = v.InferInput<typeof UserCountsSchema>;
const GroupCountsSchema = v.required(
	v.object({
		channels: v.pipe(v.number(), v.integer()),
		users: v.pipe(v.number(), v.integer()),
	}),
	["channels","users"]
)
type GroupCounts = v.InferInput<typeof GroupCountsSchema>;
const ContentTypeFilterSchema = v.picklist(["Text","Image","Link","Attachment","Embed","Channel","Block"])
type ContentTypeFilter = v.InferInput<typeof ContentTypeFilterSchema>;
const SearchTypeFilterSchema = v.picklist(["All","Text","Image","Link","Attachment","Embed","Channel","Block","User","Group"])
type SearchTypeFilter = v.InferInput<typeof SearchTypeFilterSchema>;
const FileExtensionSchema = v.picklist(["aac","ai","aiff","avi","avif","bmp","csv","doc","docx","eps","epub","fla","gif","h264","heic","heif","ind","indd","jpeg","jpg","key","kml","kmz","latex","m4a","ma","mb","mid","midi","mov","mp3","mp4","mp4v","mpeg","mpg","mpg4","numbers","oga","ogg","ogv","otf","pages","pdf","pgp","png","ppt","pptx","psd","svg","swa","swf","tex","texi","texinfo","tfm","tif","tiff","torrent","ttc","ttf","txt","wav","webm","webp","wma","xls","xlsx","xlt"])
type FileExtension = v.InferInput<typeof FileExtensionSchema>;
const ConnectionSortSchema = v.picklist(["created_at_desc","created_at_asc"])
type ConnectionSort = v.InferInput<typeof ConnectionSortSchema>;
const ChannelContentSortSchema = v.picklist(["position_asc","position_desc","created_at_asc","created_at_desc","updated_at_asc","updated_at_desc"])
type ChannelContentSort = v.InferInput<typeof ChannelContentSortSchema>;
const ContentSortSchema = v.picklist(["created_at_asc","created_at_desc","updated_at_asc","updated_at_desc"])
type ContentSort = v.InferInput<typeof ContentSortSchema>;
const BlockProviderSchema = v.required(
	v.object({
		name: v.string(),
		url: v.string(),
	}),
	["name","url"]
)
type BlockProvider = v.InferInput<typeof BlockProviderSchema>;
const ImageVersionSchema = v.object({
	src: v.string(),
	src_1x: v.string(),
	src_2x: v.string(),
	width: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	height: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
})
type ImageVersion = v.InferInput<typeof ImageVersionSchema>;
const BlockEmbedSchema = v.object({
	url: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	type: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	title: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	author_name: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	author_url: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	source_url: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	width: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	height: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	html: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	thumbnail_url: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
})
type BlockEmbed = v.InferInput<typeof BlockEmbedSchema>;
const BlockAttachmentSchema = v.object({
	filename: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	content_type: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	file_size: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	file_extension: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	updated_at: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	url: v.string(),
})
type BlockAttachment = v.InferInput<typeof BlockAttachmentSchema>;
const ChannelCountsSchema = v.required(
	v.object({
		blocks: v.pipe(v.number(), v.integer()),
		channels: v.pipe(v.number(), v.integer()),
		contents: v.pipe(v.number(), v.integer()),
		collaborators: v.pipe(v.number(), v.integer()),
	}),
	["blocks","channels","contents","collaborators"]
)
type ChannelCounts = v.InferInput<typeof ChannelCountsSchema>;
const PaginationMetaWithCountSchema = v.object({
	current_page: v.pipe(v.number(), v.integer()),
	next_page: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	prev_page: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	per_page: v.pipe(v.number(), v.integer()),
	total_pages: v.pipe(v.number(), v.integer()),
	total_count: v.pipe(v.number(), v.integer()),
	has_more_pages: v.boolean(),
})
type PaginationMetaWithCount = v.InferInput<typeof PaginationMetaWithCountSchema>;
const PaginationMetaWithoutCountSchema = v.object({
	current_page: v.pipe(v.number(), v.integer()),
	next_page: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	prev_page: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	per_page: v.pipe(v.number(), v.integer()),
	has_more_pages: v.boolean(),
})
type PaginationMetaWithoutCount = v.InferInput<typeof PaginationMetaWithoutCountSchema>;
const PingResponseSchema = v.required(
	v.object({
		status: v.picklist(["ok"]),
	}),
	["status"]
)
type PingResponse = v.InferInput<typeof PingResponseSchema>;
const LinksSchema = v.required(
	v.object({
		self: LinkSchema,
	}),
	["self"]
)
type Links = v.InferInput<typeof LinksSchema>;
const ConnectionContextSchema = v.required(
	v.object({
		id: v.pipe(v.number(), v.integer()),
		position: v.pipe(v.number(), v.integer()),
		pinned: v.boolean(),
		connected_at: v.string(),
		connected_by: v.union([
				EmbeddedUserSchema,
				v.null(), v.undefined(),
		]),
	}),
	["id","position","pinned","connected_at","connected_by"]
)
type ConnectionContext = v.InferInput<typeof ConnectionContextSchema>;
const ChannelOwnerSchema = v.union([
	EmbeddedUserSchema,
	EmbeddedGroupSchema,
])
type ChannelOwner = v.InferInput<typeof ChannelOwnerSchema>;
const BlockSourceSchema = v.object({
	url: v.string(),
	title: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	provider: v.union([
			BlockProviderSchema,
			v.null(), v.undefined(),
	]),
})
type BlockSource = v.InferInput<typeof BlockSourceSchema>;
const BlockImageSchema = v.object({
	alt_text: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	blurhash: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	width: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	height: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	aspect_ratio: v.union([
			v.number(),
			v.null(), v.undefined(),
	]),
	content_type: v.string(),
	filename: v.string(),
	file_size: v.union([
			v.pipe(v.number(), v.integer()),
			v.null(), v.undefined(),
	]),
	updated_at: v.string(),
	small: ImageVersionSchema,
	medium: ImageVersionSchema,
	large: ImageVersionSchema,
	square: ImageVersionSchema,
})
type BlockImage = v.InferInput<typeof BlockImageSchema>;
const PaginatedResponseWithCountBaseSchema = v.required(
	v.partial(v.object({
		meta: PaginationMetaWithCountSchema,
	})),
	["meta"]
)
type PaginatedResponseWithCountBase = v.InferInput<typeof PaginatedResponseWithCountBaseSchema>;
const PaginationMetaSchema = v.union([
	PaginationMetaWithCountSchema,
	PaginationMetaWithoutCountSchema,
])
type PaginationMeta = v.InferInput<typeof PaginationMetaSchema>;
const UserSchema = v.intersect([
	EmbeddedUserSchema,
	v.object({
	created_at: v.string(),
	updated_at: v.string(),
	bio: v.union([
			MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	counts: UserCountsSchema,
	_links: LinksSchema,
}),
])
type User = v.InferInput<typeof UserSchema>;
const GroupSchema = v.intersect([
	EmbeddedGroupSchema,
	v.object({
	bio: v.union([
			MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	created_at: v.string(),
	updated_at: v.string(),
	user: EmbeddedUserSchema,
	counts: GroupCountsSchema,
	_links: LinksSchema,
}),
])
type Group = v.InferInput<typeof GroupSchema>;
const CommentSchema = v.object({
	id: v.pipe(v.number(), v.integer()),
	type: v.picklist(["Comment"]),
	body: v.union([
			MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	created_at: v.string(),
	updated_at: v.string(),
	user: EmbeddedUserSchema,
	_links: LinksSchema,
})
type Comment = v.InferInput<typeof CommentSchema>;
const ChannelSchema = v.object({
	id: v.pipe(v.number(), v.integer()),
	type: v.picklist(["Channel"]),
	slug: v.string(),
	title: v.string(),
	description: v.union([
			MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	state: v.picklist(["available","deleted"]),
	visibility: v.picklist(["public","private","closed"]),
	created_at: v.string(),
	updated_at: v.string(),
	owner: ChannelOwnerSchema,
	counts: ChannelCountsSchema,
	_links: LinksSchema,
	connection: v.union([
			ConnectionContextSchema,
			v.null(), v.undefined(),
	]),
})
type Channel = v.InferInput<typeof ChannelSchema>;
const BaseBlockPropertiesSchema = v.object({
	id: v.pipe(v.number(), v.integer()),
	base_type: v.picklist(["Block"]),
	title: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	description: v.union([
			MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	state: v.picklist(["available","pending","failed","processing"]),
	visibility: v.picklist(["public","private","orphan"]),
	comment_count: v.pipe(v.number(), v.integer()),
	created_at: v.string(),
	updated_at: v.string(),
	user: EmbeddedUserSchema,
	source: v.union([
			BlockSourceSchema,
			v.null(), v.undefined(),
	]),
	_links: LinksSchema,
	connection: v.union([
			ConnectionContextSchema,
			v.null(), v.undefined(),
	]),
})
type BaseBlockProperties = v.InferInput<typeof BaseBlockPropertiesSchema>;
const PaginatedResponseBaseSchema = v.required(
	v.partial(v.object({
		meta: PaginationMetaSchema,
	})),
	["meta"]
)
type PaginatedResponseBase = v.InferInput<typeof PaginatedResponseBaseSchema>;
const UserListSchema = v.required(
	v.object({
		data: v.array(
				UserSchema
		),
	}),
	["data"]
)
type UserList = v.InferInput<typeof UserListSchema>;
const CommentListSchema = v.required(
	v.object({
		data: v.array(
				CommentSchema
		),
	}),
	["data"]
)
type CommentList = v.InferInput<typeof CommentListSchema>;
const ChannelListSchema = v.required(
	v.object({
		data: v.array(
				ChannelSchema
		),
	}),
	["data"]
)
type ChannelList = v.InferInput<typeof ChannelListSchema>;
const FollowableListSchema = v.required(
	v.object({
		data: v.array(
				v.union([
					UserSchema,
					ChannelSchema,
					GroupSchema,
				])
		),
	}),
	["data"]
)
type FollowableList = v.InferInput<typeof FollowableListSchema>;
const TextBlockSchema = v.intersect([
	BaseBlockPropertiesSchema,
	v.required(
	v.object({
		type: v.picklist(["Text"]),
		content: MarkdownContentSchema,
	}),
	["type","content"]
),
])
type TextBlock = v.InferInput<typeof TextBlockSchema>;
const ImageBlockSchema = v.intersect([
	BaseBlockPropertiesSchema,
	v.required(
	v.object({
		type: v.picklist(["Image"]),
		image: BlockImageSchema,
	}),
	["type","image"]
),
])
type ImageBlock = v.InferInput<typeof ImageBlockSchema>;
const LinkBlockSchema = v.intersect([
	BaseBlockPropertiesSchema,
	v.object({
	type: v.picklist(["Link"]),
	image: v.union([
			BlockImageSchema,
			v.null(), v.undefined(),
	]),
	content: v.union([
			MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
}),
])
type LinkBlock = v.InferInput<typeof LinkBlockSchema>;
const AttachmentBlockSchema = v.intersect([
	BaseBlockPropertiesSchema,
	v.object({
	type: v.picklist(["Attachment"]),
	attachment: BlockAttachmentSchema,
	image: v.union([
			BlockImageSchema,
			v.null(), v.undefined(),
	]),
}),
])
type AttachmentBlock = v.InferInput<typeof AttachmentBlockSchema>;
const EmbedBlockSchema = v.intersect([
	BaseBlockPropertiesSchema,
	v.object({
	type: v.picklist(["Embed"]),
	embed: BlockEmbedSchema,
	image: v.union([
			BlockImageSchema,
			v.null(), v.undefined(),
	]),
}),
])
type EmbedBlock = v.InferInput<typeof EmbedBlockSchema>;
const UserListResponseSchema = v.intersect([
	UserListSchema,
	PaginatedResponseWithCountBaseSchema,
])
type UserListResponse = v.InferInput<typeof UserListResponseSchema>;
const CommentListResponseSchema = v.intersect([
	CommentListSchema,
	PaginatedResponseWithCountBaseSchema,
])
type CommentListResponse = v.InferInput<typeof CommentListResponseSchema>;
const ChannelListResponseSchema = v.intersect([
	ChannelListSchema,
	PaginatedResponseWithCountBaseSchema,
])
type ChannelListResponse = v.InferInput<typeof ChannelListResponseSchema>;
const FollowableListResponseSchema = v.intersect([
	FollowableListSchema,
	PaginatedResponseWithCountBaseSchema,
])
type FollowableListResponse = v.InferInput<typeof FollowableListResponseSchema>;
const BlockSchema = v.union([
	TextBlockSchema,
	ImageBlockSchema,
	LinkBlockSchema,
	AttachmentBlockSchema,
	EmbedBlockSchema,
])
type Block = v.InferInput<typeof BlockSchema>;
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
				])
		),
	}),
	["data"]
)
type ConnectableList = v.InferInput<typeof ConnectableListSchema>;
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
				])
		),
	}),
	["data"]
)
type EverythingList = v.InferInput<typeof EverythingListSchema>;
const ConnectableListResponseSchema = v.intersect([
	ConnectableListSchema,
	PaginatedResponseBaseSchema,
])
type ConnectableListResponse = v.InferInput<typeof ConnectableListResponseSchema>;
const EverythingListResponseSchema = v.intersect([
	EverythingListSchema,
	PaginatedResponseWithCountBaseSchema,
])
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
 	type EverythingListResponse
};