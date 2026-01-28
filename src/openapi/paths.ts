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
			formData: v.object({ "grant_type": v.picklist(["authorization_code", "client_credentials"]), "client_id": v.optional(v.string()), "client_secret": v.optional(v.string()), "code": v.optional(v.string()), "redirect_uri": v.optional(v.pipe(v.string(), v.url())), "code_verifier": v.optional(v.string()) })
		},
		response: {
			"200": {
				"application/json": v.object({ "access_token": v.string(), "token_type": v.literal("Bearer"), "scope": v.string(), "created_at": v.pipe(v.number(), v.integer()) })
			},
			"400": {
				"application/json": v.object({ "error": v.optional(v.picklist(["invalid_request", "invalid_client", "invalid_grant", "unauthorized_client", "unsupported_grant_type"])), "error_description": v.optional(v.string()) })
			},
			"401": {
				"application/json": v.object({ "error": v.optional(v.string()), "error_description": v.optional(v.string()) })
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
				"application/yaml": v.string()
			},
			"404": {
				"application/json": s.ErrorSchema
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
				"application/json": v.object({})
			},
			"404": {
				"application/json": s.ErrorSchema
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
				"application/json": s.PingResponseSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.pipe(v.number(), v.integer()) })
		},
		response: {
			"200": {
				"application/json": s.BlockSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])), "filter": v.optional(v.picklist(["ALL", "OWN", "EXCLUDE_OWN"])) })
		},
		response: {
			"200": {
				"application/json": s.ChannelListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.pipe(v.number(), v.integer()) }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) })
		},
		response: {
			"200": {
				"application/json": s.CommentListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			body: v.object({ "title": v.string(), "visibility": v.optional(v.picklist(["public", "private", "closed"])), "description": v.optional(v.string()), "group_id": v.optional(v.pipe(v.number(), v.integer())) })
		},
		response: {
			"201": {
				"application/json": s.ChannelSchema
			},
			"400": {
				"application/json": s.ErrorSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"422": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() })
		},
		response: {
			"200": {
				"application/json": s.ChannelSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			body: v.object({ "title": v.optional(v.string()), "visibility": v.optional(v.picklist(["public", "private", "closed"])), "description": v.optional(v.union([v.string(), v.null_()])) })
		},
		response: {
			"200": {
				"application/json": s.ChannelSchema
			},
			"400": {
				"application/json": s.ErrorSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"422": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() })
		},
		response: {
			"204": {
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
			}
		}
	},
	createChannelBlock: {
		path: "/v3/channels/{id}/blocks",
		method: "post",
		tags: [
			"Blocks"
		],
		parameters: {
			path: v.object({ "id": v.string() }),
			body: v.object({ "source": v.optional(v.pipe(v.string(), v.url())), "content": v.optional(v.string()), "title": v.optional(v.string()), "description": v.optional(v.string()) })
		},
		response: {
			"201": {
				"application/json": s.BlockSchema
			},
			"400": {
				"application/json": s.ErrorSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"422": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["position_asc", "position_desc", "created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"])), "user_id": v.optional(v.pipe(v.number(), v.integer())) })
		},
		response: {
			"200": {
				"application/json": s.ConnectableListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) })
		},
		response: {
			"200": {
				"application/json": s.ChannelListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) })
		},
		response: {
			"200": {
				"application/json": s.UserListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
				"application/json": s.UserSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() })
		},
		response: {
			"200": {
				"application/json": s.UserSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"])), "type": v.optional(v.picklist(["Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block"])) })
		},
		response: {
			"200": {
				"application/json": s.ConnectableListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) })
		},
		response: {
			"200": {
				"application/json": s.UserListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])), "type": v.optional(v.picklist(["User", "Channel", "Group"])) })
		},
		response: {
			"200": {
				"application/json": s.FollowableListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() })
		},
		response: {
			"200": {
				"application/json": s.GroupSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_asc", "created_at_desc", "updated_at_asc", "updated_at_desc"])), "type": v.optional(v.picklist(["Text", "Image", "Link", "Attachment", "Embed", "Channel", "Block"])) })
		},
		response: {
			"200": {
				"application/json": s.ConnectableListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			path: v.object({ "id": v.string() }),
			query: v.object({ "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))), "sort": v.optional(v.picklist(["created_at_desc", "created_at_asc"])) })
		},
		response: {
			"200": {
				"application/json": s.UserListResponseSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"404": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
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
			query: v.object({ "q": v.optional(v.string()), "type": v.optional(v.array(s.SearchTypeFilterSchema)), "scope": v.optional(v.string()), "in": v.optional(v.array(v.picklist(["name", "description", "content", "domain", "url"]))), "ext": v.optional(v.array(s.FileExtensionSchema)), "sort": v.optional(v.picklist(["score_desc", "created_at_desc", "created_at_asc", "updated_at_desc", "updated_at_asc", "name_asc", "name_desc", "connections_count_desc", "random"])), "after": v.optional(v.pipe(v.string(), v.isoDateTime())), "seed": v.optional(v.pipe(v.number(), v.integer())), "page": v.optional(v.pipe(v.number(), v.minValue(1))), "per": v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))) })
		},
		response: {
			"200": {
				"application/json": s.EverythingListResponseSchema
			},
			"400": {
				"application/json": s.ErrorSchema
			},
			"401": {
				"application/json": s.ErrorSchema
			},
			"403": {
				"application/json": s.ErrorSchema
			},
			"429": {
				"application/json": s.RateLimitErrorSchema
			}
		}
	}
} as const;
export default {
	operations
};