import * as v from "valibot";
import * as s from "./schemas";

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
const ChannelVisibilitySchema = v.picklist(["public","private","closed"])
type ChannelVisibility = v.InferInput<typeof ChannelVisibilitySchema>;
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
const ChannelAbilitiesSchema = v.required(
	v.object({
		add_to: v.boolean(),
		update: v.boolean(),
		destroy: v.boolean(),
		manage_collaborators: v.boolean(),
	}),
	["add_to","update","destroy","manage_collaborators"]
)
type ChannelAbilities = v.InferInput<typeof ChannelAbilitiesSchema>;
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
	v.objectWithRest(
		{
			self: s.LinkSchema,
		},
		LinkSchema
	),
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
				s.EmbeddedUserSchema,
				v.null(), v.undefined(),
		]),
	}),
	["id","position","pinned","connected_at","connected_by"]
)
type ConnectionContext = v.InferInput<typeof ConnectionContextSchema>;
const ChannelOwnerSchema = v.union([
	s.EmbeddedUserSchema,
	s.EmbeddedGroupSchema,
])
type ChannelOwner = v.InferInput<typeof ChannelOwnerSchema>;
const BlockSourceSchema = v.object({
	url: v.string(),
	title: v.union([
			v.string(),
			v.null(), v.undefined(),
	]),
	provider: v.union([
			s.BlockProviderSchema,
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
	small: s.ImageVersionSchema,
	medium: s.ImageVersionSchema,
	large: s.ImageVersionSchema,
	square: s.ImageVersionSchema,
})
type BlockImage = v.InferInput<typeof BlockImageSchema>;
const PaginatedResponseWithCountBaseSchema = v.required(
	v.partial(v.object({
		meta: s.PaginationMetaWithCountSchema,
	})),
	["meta"]
)
type PaginatedResponseWithCountBase = v.InferInput<typeof PaginatedResponseWithCountBaseSchema>;
const PaginationMetaSchema = v.union([
	s.PaginationMetaWithCountSchema,
	s.PaginationMetaWithoutCountSchema,
])
type PaginationMeta = v.InferInput<typeof PaginationMetaSchema>;
const UserSchema = v.intersect([
	s.EmbeddedUserSchema,
	v.object({
	created_at: v.string(),
	updated_at: v.string(),
	bio: v.union([
			s.MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	counts: s.UserCountsSchema,
	_links: s.LinksSchema,
}),
])
type User = v.InferInput<typeof UserSchema>;
const GroupSchema = v.intersect([
	s.EmbeddedGroupSchema,
	v.object({
	bio: v.union([
			s.MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	created_at: v.string(),
	updated_at: v.string(),
	user: s.EmbeddedUserSchema,
	counts: s.GroupCountsSchema,
	_links: s.LinksSchema,
}),
])
type Group = v.InferInput<typeof GroupSchema>;
const CommentSchema = v.object({
	id: v.pipe(v.number(), v.integer()),
	type: v.picklist(["Comment"]),
	body: v.union([
			s.MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	created_at: v.string(),
	updated_at: v.string(),
	user: s.EmbeddedUserSchema,
	_links: s.LinksSchema,
})
type Comment = v.InferInput<typeof CommentSchema>;
const ChannelSchema = v.object({
	id: v.pipe(v.number(), v.integer()),
	type: v.picklist(["Channel"]),
	slug: v.string(),
	title: v.string(),
	description: v.union([
			s.MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	state: v.picklist(["available","deleted"]),
	visibility: s.ChannelVisibilitySchema,
	created_at: v.string(),
	updated_at: v.string(),
	owner: s.ChannelOwnerSchema,
	counts: s.ChannelCountsSchema,
	_links: s.LinksSchema,
	connection: v.union([
			s.ConnectionContextSchema,
			v.null(), v.undefined(),
	]),
	can: s.ChannelAbilitiesSchema,
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
			s.MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
	state: v.picklist(["available","pending","failed","processing"]),
	visibility: v.picklist(["public","private","orphan"]),
	comment_count: v.pipe(v.number(), v.integer()),
	created_at: v.string(),
	updated_at: v.string(),
	user: s.EmbeddedUserSchema,
	source: v.union([
			s.BlockSourceSchema,
			v.null(), v.undefined(),
	]),
	_links: s.LinksSchema,
	connection: v.union([
			s.ConnectionContextSchema,
			v.null(), v.undefined(),
	]),
})
type BaseBlockProperties = v.InferInput<typeof BaseBlockPropertiesSchema>;
const PaginatedResponseBaseSchema = v.required(
	v.partial(v.object({
		meta: s.PaginationMetaSchema,
	})),
	["meta"]
)
type PaginatedResponseBase = v.InferInput<typeof PaginatedResponseBaseSchema>;
const UserListSchema = v.required(
	v.object({
		data: v.array(
				s.UserSchema
		),
	}),
	["data"]
)
type UserList = v.InferInput<typeof UserListSchema>;
const CommentListSchema = v.required(
	v.object({
		data: v.array(
				s.CommentSchema
		),
	}),
	["data"]
)
type CommentList = v.InferInput<typeof CommentListSchema>;
const ChannelListSchema = v.required(
	v.object({
		data: v.array(
				s.ChannelSchema
		),
	}),
	["data"]
)
type ChannelList = v.InferInput<typeof ChannelListSchema>;
const FollowableListSchema = v.required(
	v.object({
		data: v.array(
				v.union([
					s.UserSchema,
					s.ChannelSchema,
					s.GroupSchema,
				])
		),
	}),
	["data"]
)
type FollowableList = v.InferInput<typeof FollowableListSchema>;
const TextBlockSchema = v.intersect([
	s.BaseBlockPropertiesSchema,
	v.required(
	v.object({
		type: v.picklist(["Text"]),
		content: s.MarkdownContentSchema,
	}),
	["type","content"]
),
])
type TextBlock = v.InferInput<typeof TextBlockSchema>;
const ImageBlockSchema = v.intersect([
	s.BaseBlockPropertiesSchema,
	v.required(
	v.object({
		type: v.picklist(["Image"]),
		image: s.BlockImageSchema,
	}),
	["type","image"]
),
])
type ImageBlock = v.InferInput<typeof ImageBlockSchema>;
const LinkBlockSchema = v.intersect([
	s.BaseBlockPropertiesSchema,
	v.object({
	type: v.picklist(["Link"]),
	image: v.union([
			s.BlockImageSchema,
			v.null(), v.undefined(),
	]),
	content: v.union([
			s.MarkdownContentSchema,
			v.null(), v.undefined(),
	]),
}),
])
type LinkBlock = v.InferInput<typeof LinkBlockSchema>;
const AttachmentBlockSchema = v.intersect([
	s.BaseBlockPropertiesSchema,
	v.object({
	type: v.picklist(["Attachment"]),
	attachment: s.BlockAttachmentSchema,
	image: v.union([
			s.BlockImageSchema,
			v.null(), v.undefined(),
	]),
}),
])
type AttachmentBlock = v.InferInput<typeof AttachmentBlockSchema>;
const EmbedBlockSchema = v.intersect([
	s.BaseBlockPropertiesSchema,
	v.object({
	type: v.picklist(["Embed"]),
	embed: s.BlockEmbedSchema,
	image: v.union([
			s.BlockImageSchema,
			v.null(), v.undefined(),
	]),
}),
])
type EmbedBlock = v.InferInput<typeof EmbedBlockSchema>;
const UserListResponseSchema = v.intersect([
	s.UserListSchema,
	s.PaginatedResponseWithCountBaseSchema,
])
type UserListResponse = v.InferInput<typeof UserListResponseSchema>;
const CommentListResponseSchema = v.intersect([
	s.CommentListSchema,
	s.PaginatedResponseWithCountBaseSchema,
])
type CommentListResponse = v.InferInput<typeof CommentListResponseSchema>;
const ChannelListResponseSchema = v.intersect([
	s.ChannelListSchema,
	s.PaginatedResponseWithCountBaseSchema,
])
type ChannelListResponse = v.InferInput<typeof ChannelListResponseSchema>;
const FollowableListResponseSchema = v.intersect([
	s.FollowableListSchema,
	s.PaginatedResponseWithCountBaseSchema,
])
type FollowableListResponse = v.InferInput<typeof FollowableListResponseSchema>;
const BlockSchema = v.union([
	s.TextBlockSchema,
	s.ImageBlockSchema,
	s.LinkBlockSchema,
	s.AttachmentBlockSchema,
	s.EmbedBlockSchema,
])
type Block = v.InferInput<typeof BlockSchema>;
const ConnectableListSchema = v.required(
	v.object({
		data: v.array(
				v.union([
					s.TextBlockSchema,
					s.ImageBlockSchema,
					s.LinkBlockSchema,
					s.AttachmentBlockSchema,
					s.EmbedBlockSchema,
					s.ChannelSchema,
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
					s.TextBlockSchema,
					s.ImageBlockSchema,
					s.LinkBlockSchema,
					s.AttachmentBlockSchema,
					s.EmbedBlockSchema,
					s.ChannelSchema,
					s.UserSchema,
					s.GroupSchema,
				])
		),
	}),
	["data"]
)
type EverythingList = v.InferInput<typeof EverythingListSchema>;
const ConnectableListResponseSchema = v.intersect([
	s.ConnectableListSchema,
	s.PaginatedResponseBaseSchema,
])
type ConnectableListResponse = v.InferInput<typeof ConnectableListResponseSchema>;
const EverythingListResponseSchema = v.intersect([
	s.EverythingListSchema,
	s.PaginatedResponseWithCountBaseSchema,
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
 	ChannelVisibilitySchema,
 	type ChannelVisibility,
 	BlockProviderSchema,
 	type BlockProvider,
 	ImageVersionSchema,
 	type ImageVersion,
 	BlockEmbedSchema,
 	type BlockEmbed,
 	BlockAttachmentSchema,
 	type BlockAttachment,
 	ChannelAbilitiesSchema,
 	type ChannelAbilities,
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