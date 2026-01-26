import * as s from './schemas';

const UnauthorizedResponseSchema = {
  'application/json': s.ErrorSchema,
};
type UnauthorizedResponse = v.InferOutput<typeof UnauthorizedResponseSchema>;
const NotFoundResponseSchema = {
  'application/json': s.ErrorSchema,
};
type NotFoundResponse = v.InferOutput<typeof NotFoundResponseSchema>;
const ValidationErrorResponseSchema = {
  'application/json': s.ErrorSchema,
};
type ValidationErrorResponse = v.InferOutput<
  typeof ValidationErrorResponseSchema
>;
const ForbiddenResponseSchema = {
  'application/json': s.ErrorSchema,
};
type ForbiddenResponse = v.InferOutput<typeof ForbiddenResponseSchema>;
const RateLimitResponseSchema = {
  'application/json': s.RateLimitErrorSchema,
};
type RateLimitResponse = v.InferOutput<typeof RateLimitResponseSchema>;

export {
  UnauthorizedResponseSchema,
  type UnauthorizedResponse,
  NotFoundResponseSchema,
  type NotFoundResponse,
  ValidationErrorResponseSchema,
  type ValidationErrorResponse,
  ForbiddenResponseSchema,
  type ForbiddenResponse,
  RateLimitResponseSchema,
  type RateLimitResponse,
};
