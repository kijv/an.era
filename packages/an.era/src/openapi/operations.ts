import * as v from "valibot";
import * as s from "./components/schemas";
export const operations = {
	createOAuthToken: {
		path: "/v3/oauth/token",
		method: "post",
		tags: [
			"Authentication"
		],
		parameters: {
			formData: v.object({ "grant_type": v.picklist(["authorization_code", "client_credentials"]), "client_id": v.optional(v.string()), "client_secret": v.optional(v.string()), "code": v.optional(v.string()), "redirect_uri": v.optional(v.pipe(v.string(), v.url())), "code_verifier": v.optional(v.string()) }) as unknown as { __TYPE__: { grant_type: "authorization_code" | "client_credentials", client_id?: string, client_secret?: string, code?: string, redirect_uri?: string, code_verifier?: string } }
		},
		response: {
			"200": {
				"application/json": v.object({ "access_token": v.string(), "token_type": v.literal("Bearer"), "scope": v.string(), "created_at": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { access_token: string, token_type: "Bearer", scope: string, created_at: number } }
			},
			"400": {
				"application/json": v.object({ "error": v.optional(v.picklist(["invalid_request", "invalid_client", "invalid_grant", "unauthorized_client", "unsupported_grant_type"])), "error_description": v.optional(v.string()) }) as unknown as { __TYPE__: { error?: "invalid_request" | "invalid_client" | "invalid_grant" | "unauthorized_client" | "unsupported_grant_type", error_description?: string } }
			},
			"401": {
				"application/json": v.object({ "error": v.optional(v.string()), "error_description": v.optional(v.string()) }) as unknown as { __TYPE__: { error?: string, error_description?: string } }
			}
		}
	},
	getOpenapiSpec: {
		path: "/v3/openapi",
		method: "get",
		tags: [
			"System"
		],
		parameters: {
		},
		response: {
			"200": {
				"application/yaml": v.string() as unknown as { __TYPE__: string }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			}
		}
	},
	getOpenapiSpecJson: {
		path: "/v3/openapi.json",
		method: "get",
		tags: [
			"System"
		],
		parameters: {
		},
		response: {
			"200": {
				"application/json": v.object({}) as unknown as { __TYPE__: {} }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			}
		}
	},
	getPing: {
		path: "/v3/ping",
		method: "get",
		tags: [
			"System"
		],
		parameters: {
		},
		response: {
			"200": {
				"application/json": s.PingResponseSchema as unknown as { __TYPE__: s.PingResponse }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	createBlock: {
		path: "/v3/blocks",
		method: "post",
		tags: [
			"Blocks"
		],
		parameters: {
			body: v.object({ "value": v.string(), "title": v.optional(v.string()), "description": v.optional(v.string()), "original_source_url": v.optional(v.pipe(v.string(), v.url())), "original_source_title": v.optional(v.string()), "alt_text": v.optional(v.string()) }) as unknown as { __TYPE__: { value: string, title?: string, description?: string, original_source_url?: string, original_source_title?: string, alt_text?: string } }
		},
		response: {
			"201": {
				"application/json": s.BlockSchema as unknown as { __TYPE__: s.Block }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	bulkCreateBlocks: {
		path: "/v3/blocks/bulk",
		method: "post",
		tags: [
			"Blocks"
		],
		parameters: {
			body: v.object({ "channel_ids": v.pipe(v.array(v.union([v.pipe(v.number(), v.integer()), v.string()])), v.minLength(1), v.maxLength(20)), "blocks": v.pipe(v.array(s.BlockInputSchema), v.minLength(1), v.maxLength(50)) }) as unknown as { __TYPE__: { channel_ids: (number | string)[], blocks: (s.BlockInput)[] } }
		},
		response: {
			"201": {
				"application/json": s.BulkBlockResponseSchema as unknown as { __TYPE__: s.BulkBlockResponse }
			},
			"207": {
				"application/json": s.BulkBlockResponseSchema as unknown as { __TYPE__: s.BulkBlockResponse }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getBlock: {
		path: "/v3/blocks/{id}",
		method: "get",
		tags: [
			"Blocks"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } }
		},
		response: {
			"200": {
				"application/json": s.BlockSchema as unknown as { __TYPE__: s.Block }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	updateBlock: {
		path: "/v3/blocks/{id}",
		method: "put",
		tags: [
			"Blocks"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } },
			body: v.object({ "title": v.optional(v.string()), "description": v.optional(v.string()), "content": v.optional(v.string()), "alt_text": v.optional(v.string()) }) as unknown as { __TYPE__: { title?: string, description?: string, content?: string, alt_text?: string } }
		},
		response: {
			"200": {
				"application/json": s.BlockSchema as unknown as { __TYPE__: s.Block }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getBlockConnections: {
		path: "/v3/blocks/{id}/connections",
		method: "get",
		tags: [
			"Blocks"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])), "filter": v.optional(v.picklist(["ALL", "OWN", "EXCLUDE_OWN"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc", filter?: "ALL" | "OWN" | "EXCLUDE_OWN" } }
		},
		response: {
			"200": {
				"application/json": s.ChannelListResponseSchema as unknown as { __TYPE__: s.ChannelListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getBlockComments: {
		path: "/v3/blocks/{id}/comments",
		method: "get",
		tags: [
			"Blocks"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc" } }
		},
		response: {
			"200": {
				"application/json": s.CommentListResponseSchema as unknown as { __TYPE__: s.CommentListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	createBlockComment: {
		path: "/v3/blocks/{id}/comments",
		method: "post",
		tags: [
			"Blocks"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } },
			body: v.object({ "body": v.string() }) as unknown as { __TYPE__: { body: string } }
		},
		response: {
			"201": {
				"application/json": s.CommentSchema as unknown as { __TYPE__: s.Comment }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	deleteComment: {
		path: "/v3/comments/{id}",
		method: "delete",
		tags: [
			"Comments"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } }
		},
		response: {
			"204": {
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	createChannel: {
		path: "/v3/channels",
		method: "post",
		tags: [
			"Channels"
		],
		parameters: {
			body: v.object({ "title": v.string(), "visibility": v.optional(v.picklist(["public", "private", "closed"])), "description": v.optional(v.string()), "group_id": v.optional(v.pipe(v.number(), v.integer())) }) as unknown as { __TYPE__: { title: string, visibility?: "public" | "private" | "closed", description?: string, group_id?: number } }
		},
		response: {
			"201": {
				"application/json": s.ChannelSchema as unknown as { __TYPE__: s.Channel }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getChannel: {
		path: "/v3/channels/{id}",
		method: "get",
		tags: [
			"Channels"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } }
		},
		response: {
			"200": {
				"application/json": s.ChannelSchema as unknown as { __TYPE__: s.Channel }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	updateChannel: {
		path: "/v3/channels/{id}",
		method: "put",
		tags: [
			"Channels"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			body: v.object({ "title": v.optional(v.string()), "visibility": v.optional(v.picklist(["public", "private", "closed"])), "description": v.optional(v.union([v.string(), v.null_()])) }) as unknown as { __TYPE__: { title?: string, visibility?: "public" | "private" | "closed", description?: string | null } }
		},
		response: {
			"200": {
				"application/json": s.ChannelSchema as unknown as { __TYPE__: s.Channel }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	deleteChannel: {
		path: "/v3/channels/{id}",
		method: "delete",
		tags: [
			"Channels"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } }
		},
		response: {
			"204": {
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	createConnection: {
		path: "/v3/connections",
		method: "post",
		tags: [
			"Connections"
		],
		parameters: {
			body: v.object({ "connectable_id": v.pipe(v.number(), v.integer()), "connectable_type": v.picklist(["Block", "Channel"]), "channel_ids": v.pipe(v.array(v.union([v.pipe(v.number(), v.integer()), v.string()])), v.minLength(1), v.maxLength(20)), "position": v.optional(v.pipe(v.number(), v.integer())) }) as unknown as { __TYPE__: { connectable_id: number, connectable_type: "Block" | "Channel", channel_ids: (number | string)[], position?: number } }
		},
		response: {
			"201": {
				"application/json": v.object({ "data": v.optional(v.array(s.ConnectionSchema)) }) as unknown as { __TYPE__: { data?: (s.Connection)[] } }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getConnection: {
		path: "/v3/connections/{id}",
		method: "get",
		tags: [
			"Connections"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } }
		},
		response: {
			"200": {
				"application/json": s.ConnectionSchema as unknown as { __TYPE__: s.Connection }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	deleteConnection: {
		path: "/v3/connections/{id}",
		method: "delete",
		tags: [
			"Connections"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } }
		},
		response: {
			"204": {
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	moveConnection: {
		path: "/v3/connections/{id}/move",
		method: "post",
		tags: [
			"Connections"
		],
		parameters: {
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }) as unknown as { __TYPE__: { id: number } },
			body: v.object({ "movement": v.optional(v.picklist(["insert_at", "move_to_top", "move_to_bottom", "move_up", "move_down"])), "position": v.optional(v.pipe(v.number(), v.integer())) }) as unknown as { __TYPE__: { movement?: "insert_at" | "move_to_top" | "move_to_bottom" | "move_up" | "move_down", position?: number } }
		},
		response: {
			"200": {
				"application/json": s.ConnectionSchema as unknown as { __TYPE__: s.Connection }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"422": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getChannelContents: {
		path: "/v3/channels/{id}/contents",
		method: "get",
		tags: [
			"Channels"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["position_asc", "position_desc", "created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"])), "user_id": v.optional(v.pipe(v.number(), v.integer())) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "position_asc" | "position_desc" | "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc", user_id?: number } }
		},
		response: {
			"200": {
				"application/json": s.ConnectableListResponseSchema as unknown as { __TYPE__: s.ConnectableListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getChannelConnections: {
		path: "/v3/channels/{id}/connections",
		method: "get",
		tags: [
			"Channels"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc" } }
		},
		response: {
			"200": {
				"application/json": s.ChannelListResponseSchema as unknown as { __TYPE__: s.ChannelListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getChannelFollowers: {
		path: "/v3/channels/{id}/followers",
		method: "get",
		tags: [
			"Channels"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc" } }
		},
		response: {
			"200": {
				"application/json": s.UserListResponseSchema as unknown as { __TYPE__: s.UserListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getCurrentUser: {
		path: "/v3/me",
		method: "get",
		tags: [
			"Users"
		],
		parameters: {
		},
		response: {
			"200": {
				"application/json": s.UserSchema as unknown as { __TYPE__: s.User }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getUser: {
		path: "/v3/users/{id}",
		method: "get",
		tags: [
			"Users"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } }
		},
		response: {
			"200": {
				"application/json": s.UserSchema as unknown as { __TYPE__: s.User }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getUserContents: {
		path: "/v3/users/{id}/contents",
		method: "get",
		tags: [
			"Users"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"])), "type": v.optional(v.picklist(["Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc", type?: "Text" | "Image" | "Link" | "Attachment" | "Embed" | "Channel" | "Block" } }
		},
		response: {
			"200": {
				"application/json": s.ConnectableListResponseSchema as unknown as { __TYPE__: s.ConnectableListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getUserFollowers: {
		path: "/v3/users/{id}/followers",
		method: "get",
		tags: [
			"Users"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc" } }
		},
		response: {
			"200": {
				"application/json": s.UserListResponseSchema as unknown as { __TYPE__: s.UserListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getUserFollowing: {
		path: "/v3/users/{id}/following",
		method: "get",
		tags: [
			"Users"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])), "type": v.optional(v.picklist(["User", "Channel", "Group"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc", type?: "User" | "Channel" | "Group" } }
		},
		response: {
			"200": {
				"application/json": s.FollowableListResponseSchema as unknown as { __TYPE__: s.FollowableListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getGroup: {
		path: "/v3/groups/{id}",
		method: "get",
		tags: [
			"Groups"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } }
		},
		response: {
			"200": {
				"application/json": s.GroupSchema as unknown as { __TYPE__: s.Group }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getGroupContents: {
		path: "/v3/groups/{id}/contents",
		method: "get",
		tags: [
			"Groups"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"])), "type": v.optional(v.picklist(["Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_asc" | "created_at_desc" | "updated_at_asc" | "updated_at_desc", type?: "Text" | "Image" | "Link" | "Attachment" | "Embed" | "Channel" | "Block" } }
		},
		response: {
			"200": {
				"application/json": s.ConnectableListResponseSchema as unknown as { __TYPE__: s.ConnectableListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	getGroupFollowers: {
		path: "/v3/groups/{id}/followers",
		method: "get",
		tags: [
			"Groups"
		],
		parameters: {
			path: v.object({ "id": v.string() }) as unknown as { __TYPE__: { id: string } },
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) }) as unknown as { __TYPE__: { page?: number, per?: number, sort?: "created_at_desc" | "created_at_asc" } }
		},
		response: {
			"200": {
				"application/json": s.UserListResponseSchema as unknown as { __TYPE__: s.UserListResponse }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"404": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	},
	search: {
		path: "/v3/search",
		method: "get",
		tags: [
			"Search"
		],
		parameters: {
			query: v.object({ "query": v.optional(v.string()), "type": v.optional(v.array(s.SearchTypeFilterSchema)), "scope": v.optional(v.picklist(["all", "my", "following"])), "user_id": v.optional(v.pipe(v.number(), v.integer())), "group_id": v.optional(v.pipe(v.number(), v.integer())), "channel_id": v.optional(v.pipe(v.number(), v.integer())), "ext": v.optional(v.array(s.FileExtensionSchema)), "sort": v.optional(v.picklist(["score_desc", "created_at_desc", "created_at_asc", "updated_at_desc", "updated_at_asc", "name_asc", "name_desc", "connections_count_desc", "random"])), "after": v.optional(v.pipe(v.string(), v.isoDateTime())), "seed": v.optional(v.pipe(v.number(), v.integer())), "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))) }) as unknown as { __TYPE__: { query?: string, type?: (s.SearchTypeFilter)[], scope?: "all" | "my" | "following", user_id?: number, group_id?: number, channel_id?: number, ext?: (s.FileExtension)[], sort?: "score_desc" | "created_at_desc" | "created_at_asc" | "updated_at_desc" | "updated_at_asc" | "name_asc" | "name_desc" | "connections_count_desc" | "random", after?: string, seed?: number, page?: number, per?: number } }
		},
		response: {
			"200": {
				"application/json": s.EverythingListResponseSchema as unknown as { __TYPE__: s.EverythingListResponse }
			},
			"400": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"401": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"403": {
				"application/json": s.ErrorSchema as unknown as { __TYPE__: s.Error }
			},
			"429": {
				"application/json": s.RateLimitErrorSchema as unknown as { __TYPE__: s.RateLimitError }
			}
		}
	}
} as const;
export default {
	operations
} as const;