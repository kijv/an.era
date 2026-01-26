import * as v from 'valibot';
import * as s from './schemas';

const PageParamSchema = v.pipe(v.number(), v.integer());
type PageParam = v.InferOutput<typeof PageParamSchema>;
const PerParamSchema = v.pipe(v.number(), v.integer());
type PerParam = v.InferOutput<typeof PerParamSchema>;
const IdParamSchema = v.pipe(v.number(), v.integer());
type IdParam = v.InferOutput<typeof IdParamSchema>;
const SlugOrIdParamSchema = v.string();
type SlugOrIdParam = v.InferOutput<typeof SlugOrIdParamSchema>;
const ConnectionSortParamSchema = s.ConnectionSortSchema;
type ConnectionSortParam = v.InferOutput<typeof ConnectionSortParamSchema>;
const ContentSortParamSchema = s.ContentSortSchema;
type ContentSortParam = v.InferOutput<typeof ContentSortParamSchema>;
const ChannelContentSortParamSchema = s.ChannelContentSortSchema;
type ChannelContentSortParam = v.InferOutput<
  typeof ChannelContentSortParamSchema
>;
const ContentTypeFilterParamSchema = s.ContentTypeFilterSchema;
type ContentTypeFilterParam = v.InferOutput<
  typeof ContentTypeFilterParamSchema
>;

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
  type ContentTypeFilterParam,
};
