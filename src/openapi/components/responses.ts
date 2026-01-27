import * as s from "./schemas";

const UnauthorizedResponse = {
	"application/json": s.ErrorSchema,
}
const NotFoundResponse = {
	"application/json": s.ErrorSchema,
}
const ValidationErrorResponse = {
	"application/json": s.ErrorSchema,
}
const ForbiddenResponse = {
	"application/json": s.ErrorSchema,
}
const UnprocessableEntityResponse = {
	"application/json": s.ErrorSchema,
}
const RateLimitResponse = {
	"application/json": s.RateLimitErrorSchema,
}

export {
	UnauthorizedResponse,
 	NotFoundResponse,
 	ValidationErrorResponse,
 	ForbiddenResponse,
 	UnprocessableEntityResponse,
 	RateLimitResponse
};