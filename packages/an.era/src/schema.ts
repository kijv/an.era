import {
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
  EverythingListResponseSchema,
} from '@/openapi/components/schemas';
import type Arena from '.';
import * as v from 'valibot';

export const isError = (input: unknown): input is Arena.Error =>
  v.is(ErrorSchema, input);

export const isRateLimitError = (
  input: unknown,
): input is Arena.RateLimitError => v.is(RateLimitErrorSchema, input);

export const isLink = (input: unknown): input is Arena.Link =>
  v.is(LinkSchema, input);

export const isMarkdownContent = (
  input: unknown,
): input is Arena.MarkdownContent => v.is(MarkdownContentSchema, input);

export const isEmbeddedUser = (input: unknown): input is Arena.EmbeddedUser =>
  v.is(EmbeddedUserSchema, input);

export const isConnectionAbilities = (
  input: unknown,
): input is Arena.ConnectionAbilities => v.is(ConnectionAbilitiesSchema, input);

export const isEmbeddedGroup = (input: unknown): input is Arena.EmbeddedGroup =>
  v.is(EmbeddedGroupSchema, input);

export const isUserCounts = (input: unknown): input is Arena.UserCounts =>
  v.is(UserCountsSchema, input);

export const isGroupCounts = (input: unknown): input is Arena.GroupCounts =>
  v.is(GroupCountsSchema, input);

export const isContentTypeFilter = (
  input: unknown,
): input is Arena.ContentTypeFilter => v.is(ContentTypeFilterSchema, input);

export const isSearchTypeFilter = (
  input: unknown,
): input is Arena.SearchTypeFilter => v.is(SearchTypeFilterSchema, input);

export const isFileExtension = (input: unknown): input is Arena.FileExtension =>
  v.is(FileExtensionSchema, input);

export const isConnectionSort = (
  input: unknown,
): input is Arena.ConnectionSort => v.is(ConnectionSortSchema, input);

export const isChannelContentSort = (
  input: unknown,
): input is Arena.ChannelContentSort => v.is(ChannelContentSortSchema, input);

export const isContentSort = (input: unknown): input is Arena.ContentSort =>
  v.is(ContentSortSchema, input);

export const isChannelVisibility = (
  input: unknown,
): input is Arena.ChannelVisibility => v.is(ChannelVisibilitySchema, input);

export const isBlockAbilities = (
  input: unknown,
): input is Arena.BlockAbilities => v.is(BlockAbilitiesSchema, input);

export const isBlockProvider = (input: unknown): input is Arena.BlockProvider =>
  v.is(BlockProviderSchema, input);

export const isImageVersion = (input: unknown): input is Arena.ImageVersion =>
  v.is(ImageVersionSchema, input);

export const isBlockEmbed = (input: unknown): input is Arena.BlockEmbed =>
  v.is(BlockEmbedSchema, input);

export const isBlockAttachment = (
  input: unknown,
): input is Arena.BlockAttachment => v.is(BlockAttachmentSchema, input);

export const isChannelAbilities = (
  input: unknown,
): input is Arena.ChannelAbilities => v.is(ChannelAbilitiesSchema, input);

export const isChannelCounts = (input: unknown): input is Arena.ChannelCounts =>
  v.is(ChannelCountsSchema, input);

export const isPaginationMeta = (
  input: unknown,
): input is Arena.PaginationMeta => v.is(PaginationMetaSchema, input);

export const isPingResponse = (input: unknown): input is Arena.PingResponse =>
  v.is(PingResponseSchema, input);

export const isLinks = (input: unknown): input is Arena.Links =>
  v.is(LinksSchema, input);

export const isEmbeddedConnection = (
  input: unknown,
): input is Arena.EmbeddedConnection => v.is(EmbeddedConnectionSchema, input);

export const isChannelOwner = (input: unknown): input is Arena.ChannelOwner =>
  v.is(ChannelOwnerSchema, input);

export const isBlockSource = (input: unknown): input is Arena.BlockSource =>
  v.is(BlockSourceSchema, input);

export const isBlockImage = (input: unknown): input is Arena.BlockImage =>
  v.is(BlockImageSchema, input);

export const isPaginatedResponse = (
  input: unknown,
): input is Arena.PaginatedResponse => v.is(PaginatedResponseSchema, input);

export const isUser = (input: unknown): input is Arena.User =>
  v.is(UserSchema, input);

export const isGroup = (input: unknown): input is Arena.Group =>
  v.is(GroupSchema, input);

export const isComment = (input: unknown): input is Arena.Comment =>
  v.is(CommentSchema, input);

export const isConnection = (input: unknown): input is Arena.Connection =>
  v.is(ConnectionSchema, input);

export const isChannel = (input: unknown): input is Arena.Channel =>
  v.is(ChannelSchema, input);

export const isBaseBlockProperties = (
  input: unknown,
): input is Arena.BaseBlockProperties => v.is(BaseBlockPropertiesSchema, input);

export const isUserList = (input: unknown): input is Arena.UserList =>
  v.is(UserListSchema, input);

export const isCommentList = (input: unknown): input is Arena.CommentList =>
  v.is(CommentListSchema, input);

export const isChannelList = (input: unknown): input is Arena.ChannelList =>
  v.is(ChannelListSchema, input);

export const isFollowableList = (
  input: unknown,
): input is Arena.FollowableList => v.is(FollowableListSchema, input);

export const isTextBlock = (input: unknown): input is Arena.TextBlock =>
  v.is(TextBlockSchema, input);

export const isImageBlock = (input: unknown): input is Arena.ImageBlock =>
  v.is(ImageBlockSchema, input);

export const isLinkBlock = (input: unknown): input is Arena.LinkBlock =>
  v.is(LinkBlockSchema, input);

export const isAttachmentBlock = (
  input: unknown,
): input is Arena.AttachmentBlock => v.is(AttachmentBlockSchema, input);

export const isEmbedBlock = (input: unknown): input is Arena.EmbedBlock =>
  v.is(EmbedBlockSchema, input);

export const isPendingBlock = (input: unknown): input is Arena.PendingBlock =>
  v.is(PendingBlockSchema, input);

export const isConnectableList = (
  input: unknown,
): input is Arena.ConnectableList => v.is(ConnectableListSchema, input);

export const isEverythingList = (
  input: unknown,
): input is Arena.EverythingList => v.is(EverythingListSchema, input);

export const isBlock = (input: unknown): input is Arena.Block =>
  v.is(BlockSchema, input);

export const isConnectableListResponse = (
  input: unknown,
): input is Arena.ConnectableListResponse =>
  v.is(ConnectableListResponseSchema, input);

export const isEverythingListResponse = (
  input: unknown,
): input is Arena.EverythingListResponse =>
  v.is(EverythingListResponseSchema, input);

export default {
  isError,
  isRateLimitError,
  isLink,
  isMarkdownContent,
  isEmbeddedUser,
  isConnectionAbilities,
  isEmbeddedGroup,
  isUserCounts,
  isGroupCounts,
  isContentTypeFilter,
  isSearchTypeFilter,
  isFileExtension,
  isConnectionSort,
  isChannelContentSort,
  isContentSort,
  isChannelVisibility,
  isBlockAbilities,
  isBlockProvider,
  isImageVersion,
  isBlockEmbed,
  isBlockAttachment,
  isChannelAbilities,
  isChannelCounts,
  isPaginationMeta,
  isPingResponse,
  isLinks,
  isEmbeddedConnection,
  isChannelOwner,
  isBlockSource,
  isBlockImage,
  isPaginatedResponse,
  isUser,
  isGroup,
  isComment,
  isConnection,
  isChannel,
  isBaseBlockProperties,
  isUserList,
  isCommentList,
  isChannelList,
  isFollowableList,
  isTextBlock,
  isImageBlock,
  isLinkBlock,
  isAttachmentBlock,
  isEmbedBlock,
  isPendingBlock,
  isConnectableList,
  isEverythingList,
  isBlock,
  isConnectableListResponse,
  isEverythingListResponse,
};
