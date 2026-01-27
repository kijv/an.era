import * as v from "valibot";
import * as s from "./schemas";

const PageParamSchema = v.pipe(v.number(), v.integer())
type PageParam = v.InferInput<typeof PageParamSchema>;
const PerParamSchema = v.pipe(v.number(), v.integer())
type PerParam = v.InferInput<typeof PerParamSchema>;
const IdParamSchema = v.pipe(v.number(), v.integer())
type IdParam = v.InferInput<typeof IdParamSchema>;
const SlugOrIdParamSchema = v.string()
type SlugOrIdParam = v.InferInput<typeof SlugOrIdParamSchema>;
const ConnectionSortParamSchema = s.ConnectionSortSchema
type ConnectionSortParam = v.InferInput<typeof ConnectionSortParamSchema>;
const ContentSortParamSchema = s.ContentSortSchema
type ContentSortParam = v.InferInput<typeof ContentSortParamSchema>;
const ChannelContentSortParamSchema = s.ChannelContentSortSchema
type ChannelContentSortParam = v.InferInput<typeof ChannelContentSortParamSchema>;
const ContentTypeFilterParamSchema = s.ContentTypeFilterSchema
type ContentTypeFilterParam = v.InferInput<typeof ContentTypeFilterParamSchema>;

export {
	PageParamSchema,
 	type PageParam,
 	PerParamSchema,
 	type PerParam,
 	IdParamSchema,
 	type IdParam,
 	SlugOrIdParamSchema,
 	type SlugOrIdParam,
 	ConnectionSortParamSchema,
 	type ConnectionSortParam,
 	ContentSortParamSchema,
 	type ContentSortParam,
 	ChannelContentSortParamSchema,
 	type ChannelContentSortParam,
 	ContentTypeFilterParamSchema,
 	type ContentTypeFilterParam
};