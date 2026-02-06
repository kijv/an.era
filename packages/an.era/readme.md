# an.era
an.era is a API wrapper for the Are.na API
## API Instance
The API instance is, by default, designed to group related functions together. These functions can be accessed via the property of their "group" name, for example `arena.channels` or `arena.blocks`, with their respective methods (shorthanded operation names). You can disable this behavior by setting the `plain` option to `true`.
#### Example
```js
import { createArena } from "an.era"

const arena = createArena({ /* configuration options... */ })

```
## Configuration
> All configuration options are optional.
#### `accessToken` (String)
Bearer token authentication.

Accepts two token types:
- OAuth2 access tokens (obtained via OAuth2 flow with Doorkeeper)
- Personal access tokens (from your account settings at are.na/settings)

Example: `Authorization: Bearer YOUR_TOKEN`

#### `plain` (Boolean)
Returned API Instance contains ungrouped functions with the names of the OpenAPI specification names. Default: `false`
#### `ignoreValidation` (Boolean)
Ignore validation errors. Meaningful if using a different <a href="#configuration-baseurl">baseUrl</a> or testing. Default: `false`
#### `baseUrl` (String)
Base URL for the Are.na API. Defaults to `https://api.are.na/v3`.
#### `requestInit` (RequestInit)
Pass additional request options to the underlying fetch API. Default: `{}`
#### `operations` ⚠️
This is intended to allow passing a different set of operations to the API instance, while still being typed. This property is subject to change and should not be relied upon.

## API Reference

### Table of contents

- [API Reference](#api-reference)
- [1 Authentication](#1-authentication)
  - [1.1 createOAuthToken](#11-createoauthtoken)
- [2 Blocks](#2-blocks)
  - [2.1 create (plain: `createBlock`)](#21-create-plain-createblock)
  - [2.2 bulkCreate (plain: `bulkCreateBlocks`)](#22-bulkcreate-plain-bulkcreateblocks)
  - [2.3 get (plain: `getBlock`)](#23-get-plain-getblock)
  - [2.4 update (plain: `updateBlock`)](#24-update-plain-updateblock)
  - [2.5 getConnections (plain: `getBlockConnections`)](#25-getconnections-plain-getblockconnections)
  - [2.6 getComments (plain: `getBlockComments`)](#26-getcomments-plain-getblockcomments)
  - [2.7 createComment (plain: `createBlockComment`)](#27-createcomment-plain-createblockcomment)
- [3 Channels](#3-channels)
  - [3.1 create (plain: `createChannel`)](#31-create-plain-createchannel)
  - [3.2 get (plain: `getChannel`)](#32-get-plain-getchannel)
  - [3.3 update (plain: `updateChannel`)](#33-update-plain-updatechannel)
  - [3.4 delete (plain: `deleteChannel`)](#34-delete-plain-deletechannel)
  - [3.5 getContents (plain: `getChannelContents`)](#35-getcontents-plain-getchannelcontents)
  - [3.6 getConnections (plain: `getChannelConnections`)](#36-getconnections-plain-getchannelconnections)
  - [3.7 getFollowers (plain: `getChannelFollowers`)](#37-getfollowers-plain-getchannelfollowers)
- [4 Comments](#4-comments)
  - [4.1 delete (plain: `deleteComment`)](#41-delete-plain-deletecomment)
- [5 Connections](#5-connections)
  - [5.1 create (plain: `createConnection`)](#51-create-plain-createconnection)
  - [5.2 get (plain: `getConnection`)](#52-get-plain-getconnection)
  - [5.3 delete (plain: `deleteConnection`)](#53-delete-plain-deleteconnection)
  - [5.4 move (plain: `moveConnection`)](#54-move-plain-moveconnection)
- [6 Groups](#6-groups)
  - [6.1 get (plain: `getGroup`)](#61-get-plain-getgroup)
  - [6.2 getContents (plain: `getGroupContents`)](#62-getcontents-plain-getgroupcontents)
  - [6.3 getFollowers (plain: `getGroupFollowers`)](#63-getfollowers-plain-getgroupfollowers)
- [7 Search](#7-search)
  - [7.1 search](#71-search)
- [8 System](#8-system)
  - [8.1 getOpenapiSpec](#81-getopenapispec)
  - [8.2 getOpenapiSpecJson](#82-getopenapispecjson)
  - [8.3 getPing](#83-getping)
- [9 Users](#9-users)
  - [9.1 getCurrent (plain: `getCurrentUser`)](#91-getcurrent-plain-getcurrentuser)
  - [9.2 get (plain: `getUser`)](#92-get-plain-getuser)
  - [9.3 getContents (plain: `getUserContents`)](#93-getcontents-plain-getusercontents)
  - [9.4 getFollowers (plain: `getUserFollowers`)](#94-getfollowers-plain-getuserfollowers)
  - [9.5 getFollowing (plain: `getUserFollowing`)](#95-getfollowing-plain-getuserfollowing)
- [Schema Reference](#schema-reference)
  - [AttachmentBlock](#referenced-schemas-attachmentblock)
  - [BaseBlockProperties](#referenced-schemas-baseblockproperties)
  - [Block](#referenced-schemas-block)
  - [BlockAbilities](#referenced-schemas-blockabilities)
  - [BlockAttachment](#referenced-schemas-blockattachment)
  - [BlockEmbed](#referenced-schemas-blockembed)
  - [BlockImage](#referenced-schemas-blockimage)
  - [BlockInput](#referenced-schemas-blockinput)
  - [BlockProvider](#referenced-schemas-blockprovider)
  - [BlockSource](#referenced-schemas-blocksource)
  - [BlockState](#referenced-schemas-blockstate)
  - [BlockVisibility](#referenced-schemas-blockvisibility)
  - [BulkBlockResponse](#referenced-schemas-bulkblockresponse)
  - [Channel](#referenced-schemas-channel)
  - [ChannelAbilities](#referenced-schemas-channelabilities)
  - [ChannelContentSort](#referenced-schemas-channelcontentsort)
  - [ChannelCounts](#referenced-schemas-channelcounts)
  - [ChannelIds](#referenced-schemas-channelids)
  - [ChannelList](#referenced-schemas-channellist)
  - [ChannelListResponse](#referenced-schemas-channellistresponse)
  - [ChannelOwner](#referenced-schemas-channelowner)
  - [ChannelState](#referenced-schemas-channelstate)
  - [ChannelVisibility](#referenced-schemas-channelvisibility)
  - [Comment](#referenced-schemas-comment)
  - [CommentList](#referenced-schemas-commentlist)
  - [CommentListResponse](#referenced-schemas-commentlistresponse)
  - [ConnectableList](#referenced-schemas-connectablelist)
  - [ConnectableListResponse](#referenced-schemas-connectablelistresponse)
  - [ConnectableType](#referenced-schemas-connectabletype)
  - [Connection](#referenced-schemas-connection)
  - [ConnectionAbilities](#referenced-schemas-connectionabilities)
  - [ConnectionFilter](#referenced-schemas-connectionfilter)
  - [ConnectionSort](#referenced-schemas-connectionsort)
  - [ContentSort](#referenced-schemas-contentsort)
  - [ContentTypeFilter](#referenced-schemas-contenttypefilter)
  - [EmbedBlock](#referenced-schemas-embedblock)
  - [EmbeddedConnection](#referenced-schemas-embeddedconnection)
  - [EmbeddedGroup](#referenced-schemas-embeddedgroup)
  - [EmbeddedUser](#referenced-schemas-embeddeduser)
  - [Error](#referenced-schemas-error)
  - [EverythingList](#referenced-schemas-everythinglist)
  - [EverythingListResponse](#referenced-schemas-everythinglistresponse)
  - [FileExtension](#referenced-schemas-fileextension)
  - [FollowableList](#referenced-schemas-followablelist)
  - [FollowableListResponse](#referenced-schemas-followablelistresponse)
  - [FollowableType](#referenced-schemas-followabletype)
  - [Group](#referenced-schemas-group)
  - [GroupCounts](#referenced-schemas-groupcounts)
  - [ImageBlock](#referenced-schemas-imageblock)
  - [ImageVersion](#referenced-schemas-imageversion)
  - [Link](#referenced-schemas-link)
  - [LinkBlock](#referenced-schemas-linkblock)
  - [Links](#referenced-schemas-links)
  - [MarkdownContent](#referenced-schemas-markdowncontent)
  - [Movement](#referenced-schemas-movement)
  - [PaginatedResponse](#referenced-schemas-paginatedresponse)
  - [PaginationMeta](#referenced-schemas-paginationmeta)
  - [PendingBlock](#referenced-schemas-pendingblock)
  - [PingResponse](#referenced-schemas-pingresponse)
  - [RateLimitError](#referenced-schemas-ratelimiterror)
  - [SearchScope](#referenced-schemas-searchscope)
  - [SearchSort](#referenced-schemas-searchsort)
  - [SearchTypeFilter](#referenced-schemas-searchtypefilter)
  - [TextBlock](#referenced-schemas-textblock)
  - [User](#referenced-schemas-user)
  - [UserCounts](#referenced-schemas-usercounts)
  - [UserList](#referenced-schemas-userlist)
  - [UserListResponse](#referenced-schemas-userlistresponse)
  - [UserTier](#referenced-schemas-usertier)

#### 1 Authentication

##### 1.1 createOAuthToken

Exchange credentials for an access token. This is the OAuth 2.0 token endpoint.

**Supported Grant Types:**

- `authorization_code`: Exchange an authorization code for an access token
- `authorization_code` + PKCE: For public clients without a client secret
- `client_credentials`: Authenticate as your application (server-to-server)

**PKCE Support:** For public clients (mobile apps, SPAs), use PKCE:
1. Generate a random `code_verifier` (43-128 chars, alphanumeric + `-._~`)
2. Create `code_challenge` = Base64URL(SHA256(code_verifier))
3. In the authorization request to `https://www.are.na/oauth/authorize`, include:
   - `code_challenge`: The generated challenge
   - `code_challenge_method`: `S256`
4. When exchanging the code at this endpoint, include `code_verifier`

See [RFC 7636](https://tools.ietf.org/html/rfc7636) for details.

Access tokens do not expire and can be used indefinitely. Register your application
at [are.na/oauth/applications](https://www.are.na/oauth/applications) to obtain client credentials.

#### 2 Blocks

##### 2.1 create (plain: `createBlock`)

Creates a new block and connects it to one or more channels.

The `value` field accepts either a URL or text content:
- If `value` is a valid URL, the block type is inferred (Image, Link, Embed, etc.)
- If `value` is plain text, a Text block is created

You can connect the block to multiple channels at once (up to 20).

**Authentication required.**

<details>
<summary>Responses</summary>

<a id="2-1-1-block"></a>
###### 2.1.1 `201`: [Block](#referenced-schemas-block) — Block created successfully

<a id="2-1-2-error"></a>
###### 2.1.2 `403`: [Error](#referenced-schemas-error) — Cannot add to one or more channels

</details>

##### 2.2 bulkCreate (plain: `bulkCreateBlocks`)

Creates multiple blocks in a single request and connects them to one or more channels.
Designed for bulk import use cases such as migrating from Pinterest, other services,
or re-importing Are.na exports.

Each block in the `blocks` array follows the same format as single block creation.
Blocks are processed sequentially and partial success is supported - if some blocks
fail, the successful ones are still created.

**Limits:**
- Maximum 50 blocks per request
- Maximum 20 channels per request

**Authentication required.**

<details>
<summary>Responses</summary>

<a id="2-2-1-bulkblockresponse"></a>
###### 2.2.1 `201`: [BulkBlockResponse](#referenced-schemas-bulkblockresponse) — All blocks created successfully

<a id="2-2-2-bulkblockresponse"></a>
###### 2.2.2 `207`: [BulkBlockResponse](#referenced-schemas-bulkblockresponse) — Partial success - some blocks failed

<a id="2-2-3-error"></a>
###### 2.2.3 `403`: [Error](#referenced-schemas-error) — Cannot add to one or more channels

</details>

##### 2.3 get (plain: `getBlock`)

Returns detailed information about a specific block by its ID. Respects visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

<details>
<summary>Responses</summary>

<a id="2-3-1-block"></a>
###### 2.3.1 `200`: [Block](#referenced-schemas-block) — Block details

</details>

##### 2.4 update (plain: `updateBlock`)

Updates a block's metadata. Only the block owner can update it.

**Authentication required.**

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

<details>
<summary>Responses</summary>

<a id="2-4-1-block"></a>
###### 2.4.1 `200`: [Block](#referenced-schemas-block) — Block updated successfully

</details>

##### 2.5 getConnections (plain: `getBlockConnections`)

Returns paginated list of channels where this block appears.
This shows all channels that contain this block, respecting visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

- **filter** (query): [ConnectionFilter](#referenced-schemas-connectionfilter) — Filter connections by ownership.

<a id="2-5-1-connectionsort"></a>
###### 2.5.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

<a id="2-5-2-connectionfilter"></a>
###### 2.5.2 Parameter: filter (query): [ConnectionFilter](#referenced-schemas-connectionfilter)
  Filter connections by who created them.
- `ALL`: All connections (default)
- `OWN`: Only connections by the current user
- `EXCLUDE_OWN`: Exclude connections by the current user

  - `ALL`
  - `OWN`
  - `EXCLUDE_OWN`

</details>

<details>
<summary>Responses</summary>

<a id="2-5-3-channellistresponse"></a>
###### 2.5.3 `200`: [ChannelListResponse](#referenced-schemas-channellistresponse) — List of channels where this block appears

</details>

##### 2.6 getComments (plain: `getBlockComments`)

Returns paginated list of comments on this block.
Comments are ordered by creation date (ascending by default, oldest first).

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

<a id="2-6-1-connectionsort"></a>
###### 2.6.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

</details>

<details>
<summary>Responses</summary>

<a id="2-6-2-commentlistresponse"></a>
###### 2.6.2 `200`: [CommentListResponse](#referenced-schemas-commentlistresponse) — List of comments on this block

</details>

##### 2.7 createComment (plain: `createBlockComment`)

Creates a new comment on a block.

**Authentication required.**

You can mention users in the comment body using `@username` syntax.

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

<details>
<summary>Responses</summary>

<a id="2-7-1-comment"></a>
###### 2.7.1 `201`: [Comment](#referenced-schemas-comment) — Comment created successfully

</details>

#### 3 Channels

##### 3.1 create (plain: `createChannel`)

Creates a new channel owned by the authenticated user or a group they belong to.

**Authentication required.**

<details>
<summary>Responses</summary>

<a id="3-1-1-channel"></a>
###### 3.1.1 `201`: [Channel](#referenced-schemas-channel) — Channel created successfully

</details>

##### 3.2 get (plain: `getChannel`)

Returns detailed information about a specific channel by its ID or slug. Respects visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

</details>

<details>
<summary>Responses</summary>

<a id="3-2-1-channel"></a>
###### 3.2.1 `200`: [Channel](#referenced-schemas-channel) — Channel details

</details>

##### 3.3 update (plain: `updateChannel`)

Updates an existing channel. Only provided fields are updated.

**Authentication required.**

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

</details>

<details>
<summary>Responses</summary>

<a id="3-3-1-channel"></a>
###### 3.3.1 `200`: [Channel](#referenced-schemas-channel) — Channel updated successfully

</details>

##### 3.4 delete (plain: `deleteChannel`)

Deletes a channel. This can not be undone.

**Authentication required.**

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

</details>

##### 3.5 getContents (plain: `getChannelContents`)

Returns paginated contents (blocks and channels) from a channel.
Respects visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ChannelContentSort](#referenced-schemas-channelcontentsort) — Sort channel contents. Use `position` for the owner's manual
arrangement, or sort by date. Defaults to `position_asc`.

- **user_id** (query): `integer` — Filter by user who added the content

<a id="3-5-1-channelcontentsort"></a>
###### 3.5.1 Parameter: sort (query): [ChannelContentSort](#referenced-schemas-channelcontentsort)
  Sort order for channel contents.
- `position_asc`: Manual order (default)
- `position_desc`: Manual order, reversed
- `created_at_desc`: Newest first
- `created_at_asc`: Oldest first
- `updated_at_desc`: Recently updated first
- `updated_at_asc`: Least recently updated first

  - `position_asc`
  - `position_desc`
  - `created_at_asc`
  - `created_at_desc`
  - `updated_at_asc`
  - `updated_at_desc`

</details>

<details>
<summary>Responses</summary>

<a id="3-5-2-connectablelistresponse"></a>
###### 3.5.2 `200`: [ConnectableListResponse](#referenced-schemas-connectablelistresponse) — Channel contents with pagination metadata

</details>

##### 3.6 getConnections (plain: `getChannelConnections`)

Returns paginated list of channels where this channel appears.
This shows all channels that contain this channel, respecting visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

<a id="3-6-1-connectionsort"></a>
###### 3.6.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

</details>

<details>
<summary>Responses</summary>

<a id="3-6-2-channellistresponse"></a>
###### 3.6.2 `200`: [ChannelListResponse](#referenced-schemas-channellistresponse) — List of channels where this channel appears

</details>

##### 3.7 getFollowers (plain: `getChannelFollowers`)

Returns paginated list of users who follow this channel.
All followers are users.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

<a id="3-7-1-connectionsort"></a>
###### 3.7.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

</details>

<details>
<summary>Responses</summary>

<a id="3-7-2-userlistresponse"></a>
###### 3.7.2 `200`: [UserListResponse](#referenced-schemas-userlistresponse) — List of users who follow this channel

</details>

#### 4 Comments

##### 4.1 delete (plain: `deleteComment`)

Deletes a comment. Only the comment author can delete their comments.

**Authentication required.**

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

#### 5 Connections

##### 5.1 create (plain: `createConnection`)

Connects a block or channel to one or more channels.
Returns the created connection(s).

**Authentication required.**

##### 5.2 get (plain: `getConnection`)

Returns detailed information about a connection,
including abilities (whether the current user can remove the connection).

The connection ID is included in the `connection` object when blocks/channels
are returned as part of channel contents.

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

<details>
<summary>Responses</summary>

<a id="5-2-1-connection"></a>
###### 5.2.1 `200`: [Connection](#referenced-schemas-connection) — Connection details

</details>

##### 5.3 delete (plain: `deleteConnection`)

Removes a block or channel from a channel by deleting the connection.
The block/channel itself is not deleted - it may still exist in other channels.

**Authentication required.**

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

##### 5.4 move (plain: `moveConnection`)

Moves a connection to a new position within its channel.
Requires sort permission on the channel.

**Authentication required.**

<details>
<summary>Parameters</summary>

- **id** (path): `integer` — Resource ID

</details>

<details>
<summary>Responses</summary>

<a id="5-4-1-connection"></a>
###### 5.4.1 `200`: [Connection](#referenced-schemas-connection) — Connection successfully moved

</details>

#### 6 Groups

##### 6.1 get (plain: `getGroup`)

Returns detailed information about a specific group by its slug. Includes group profile, bio, owner, and counts.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

</details>

<details>
<summary>Responses</summary>

<a id="6-1-1-group"></a>
###### 6.1.1 `200`: [Group](#referenced-schemas-group) — Group details

</details>

##### 6.2 getContents (plain: `getGroupContents`)

Returns paginated contents (blocks and channels) created by a group.
Uses the search API to find all content added by the specified group.
Respects visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ContentSort](#referenced-schemas-contentsort) — Sort by creation or last update time.

- **type** (query): [ContentTypeFilter](#referenced-schemas-contenttypefilter) — Filter to a specific content type.

<a id="6-2-1-contentsort"></a>
###### 6.2.1 Parameter: sort (query): [ContentSort](#referenced-schemas-contentsort)

<a id="6-2-2-contenttypefilter"></a>
###### 6.2.2 Parameter: type (query): [ContentTypeFilter](#referenced-schemas-contenttypefilter)

</details>

<details>
<summary>Responses</summary>

<a id="6-2-3-connectablelistresponse"></a>
###### 6.2.3 `200`: [ConnectableListResponse](#referenced-schemas-connectablelistresponse) — Group contents with pagination metadata

</details>

##### 6.3 getFollowers (plain: `getGroupFollowers`)

Returns paginated list of users who follow this group.
All followers are users.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

<a id="6-3-1-connectionsort"></a>
###### 6.3.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

</details>

<details>
<summary>Responses</summary>

<a id="6-3-2-userlistresponse"></a>
###### 6.3.2 `200`: [UserListResponse](#referenced-schemas-userlistresponse) — List of users who follow this group

</details>

#### 7 Search

##### 7.1 search

Search across blocks, channels, users, and groups.

**⚠️ Premium Only**: This endpoint requires a Premium subscription.

**Examples:**
- Simple: `/v3/search?query=brutalism`
- Images only: `/v3/search?query=architecture&type=Image`
- My content: `/v3/search?query=*&scope=my`
- In a channel: `/v3/search?query=design&channel_id=12345`
- By a user: `/v3/search?query=*&user_id=456`
- PDFs sorted by date: `/v3/search?query=*&ext=pdf&sort=created_at_desc`

<details>
<summary>Parameters</summary>

- **query** (query): `string` — The search query string. Supports full-text search across titles,
descriptions, and content. Use `*` as a wildcard to match everything
(useful when filtering by type, scope, or extension).

- **type** (query): `array` — Filter results by content type. Accepts comma-separated values.
- Block subtypes: `Text`, `Image`, `Link`, `Attachment`, `Embed`
- Aggregate types: `Block` (all block types), `Channel`, `User`, `Group`
- `All` returns everything (default behavior)

- **scope** (query): [SearchScope](#referenced-schemas-searchscope) — Limit search to a specific context.

- **user_id** (query): `integer` — Limit search to a specific user's content.

- **group_id** (query): `integer` — Limit search to a specific group's content.

- **channel_id** (query): `integer` — Limit search to a specific channel's content.

- **ext** (query): `array` — Filter results by file extension. Accepts comma-separated values.
Only applies to Attachment and Image block types. Common extensions
include: pdf, jpg, png, gif, mp4, mp3, doc, xls, etc.

- **sort** (query): [SearchSort](#referenced-schemas-searchsort) — Sort by relevance, date, name, or popularity. Defaults to `score_desc`.
Use `random` with `seed` for reproducible random ordering.

- **after** (query): `string` — Filter to only return results updated after this timestamp.
Useful for incremental syncing or finding recently modified content.
Format: ISO 8601 datetime string.

- **seed** (query): `integer` — Random seed for reproducible random ordering. Only used when
`sort=random`. Providing the same seed will return results in
the same order, useful for pagination through random results.

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

<a id="7-1-1-searchscope"></a>
###### 7.1.1 Parameter: scope (query): [SearchScope](#referenced-schemas-searchscope)
  Limit search to a specific context.
- `all`: Everything accessible to the user (default)
- `my`: Only the current user's own content
- `following`: Content from followed users and channels

  - `all`
  - `my`
  - `following`

<a id="7-1-2-searchsort"></a>
###### 7.1.2 Parameter: sort (query): [SearchSort](#referenced-schemas-searchsort)
  Sort order for search results.
- `score_desc`: Most relevant first (default)
- `created_at_desc`: Newest first
- `created_at_asc`: Oldest first
- `updated_at_desc`: Recently updated first
- `updated_at_asc`: Least recently updated first
- `name_asc`: Alphabetical A-Z
- `name_desc`: Alphabetical Z-A
- `connections_count_desc`: Most connected first
- `random`: Random (use `seed` for reproducibility)

  - `score_desc`
  - `created_at_desc`
  - `created_at_asc`
  - `updated_at_desc`
  - `updated_at_asc`
  - `name_asc`
  - `name_desc`
  - `connections_count_desc`
  - `random`

</details>

<details>
<summary>Responses</summary>

<a id="7-1-3-everythinglistresponse"></a>
###### 7.1.3 `200`: [EverythingListResponse](#referenced-schemas-everythinglistresponse) — Search results with pagination metadata

<a id="7-1-4-error"></a>
###### 7.1.4 `403`: [Error](#referenced-schemas-error) — Premium subscription required

</details>

#### 8 System

##### 8.1 getOpenapiSpec

Returns the OpenAPI 3.0 specification for this API in YAML format. This endpoint provides the complete API contract for programmatic access and documentation generation.

##### 8.2 getOpenapiSpecJson

Returns the OpenAPI 3.0 specification for this API in JSON format. This endpoint provides the complete API contract in JSON for tools that prefer JSON over YAML.

##### 8.3 getPing

Public utility endpoint for API health checks and connection testing.

<details>
<summary>Responses</summary>

<a id="8-3-1-pingresponse"></a>
###### 8.3.1 `200`: [PingResponse](#referenced-schemas-pingresponse) — Ping response

</details>

#### 9 Users

##### 9.1 getCurrent (plain: `getCurrentUser`)

Returns the currently authenticated user's profile

<details>
<summary>Responses</summary>

<a id="9-1-1-user"></a>
###### 9.1.1 `200`: [User](#referenced-schemas-user) — Current user details

</details>

##### 9.2 get (plain: `getUser`)

Returns detailed information about a specific user by their slug. Includes user profile, bio, and counts.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

</details>

<details>
<summary>Responses</summary>

<a id="9-2-1-user"></a>
###### 9.2.1 `200`: [User](#referenced-schemas-user) — User details

</details>

##### 9.3 getContents (plain: `getUserContents`)

Returns paginated contents (blocks and channels) created by a user.
Uses the search API to find all content added by the specified user.
Respects visibility rules and user permissions.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ContentSort](#referenced-schemas-contentsort) — Sort by creation or last update time.

- **type** (query): [ContentTypeFilter](#referenced-schemas-contenttypefilter) — Filter to a specific content type.

<a id="9-3-1-contentsort"></a>
###### 9.3.1 Parameter: sort (query): [ContentSort](#referenced-schemas-contentsort)

<a id="9-3-2-contenttypefilter"></a>
###### 9.3.2 Parameter: type (query): [ContentTypeFilter](#referenced-schemas-contenttypefilter)

</details>

<details>
<summary>Responses</summary>

<a id="9-3-3-connectablelistresponse"></a>
###### 9.3.3 `200`: [ConnectableListResponse](#referenced-schemas-connectablelistresponse) — User contents with pagination metadata

</details>

##### 9.4 getFollowers (plain: `getUserFollowers`)

Returns paginated list of users who follow this user.
All followers are users.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

<a id="9-4-1-connectionsort"></a>
###### 9.4.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

</details>

<details>
<summary>Responses</summary>

<a id="9-4-2-userlistresponse"></a>
###### 9.4.2 `200`: [UserListResponse](#referenced-schemas-userlistresponse) — List of users who follow this user

</details>

##### 9.5 getFollowing (plain: `getUserFollowing`)

Returns paginated list of users, channels, and groups that this user follows.
Can be filtered by type to return only specific followable types.

<details>
<summary>Parameters</summary>

- **id** (path): `string` — Resource ID or slug

- **page** (query): `integer` — Page number for pagination

- **per** (query): `integer` — Number of items per page (max 100)

- **sort** (query): [ConnectionSort](#referenced-schemas-connectionsort) — Sort by the date the relationship was created.

- **type** (query): [FollowableType](#referenced-schemas-followabletype) — Filter by followable type

<a id="9-5-1-connectionsort"></a>
###### 9.5.1 Parameter: sort (query): [ConnectionSort](#referenced-schemas-connectionsort)

<a id="9-5-2-followabletype"></a>
###### 9.5.2 Parameter: type (query): [FollowableType](#referenced-schemas-followabletype)
  Type of entity that can be followed.
- `User`: A user
- `Channel`: A channel
- `Group`: A group

  - `User`
  - `Channel`
  - `Group`

</details>

<details>
<summary>Responses</summary>

<a id="9-5-3-followablelistresponse"></a>
###### 9.5.3 `200`: [FollowableListResponse](#referenced-schemas-followablelistresponse) — List of users, channels, and groups that this user follows

</details>

#### Schema Reference

##### AttachmentBlock

<a id="referenced-schemas-attachmentblock"></a>

  An attachment block containing an uploaded file
  - [BaseBlockProperties](#referenced-schemas-baseblockproperties) and Object
    - `type`: String — Block type (always "Attachment" for AttachmentBlock)
    - `attachment`: [BlockAttachment](#referenced-schemas-blockattachment)
    - `image`: [BlockImage](#referenced-schemas-blockimage) or Null — Preview image (for PDFs and other previewable files)

##### BaseBlockProperties

<a id="referenced-schemas-baseblockproperties"></a>

  Common properties shared by all block types
  - `id`: Integer — Unique identifier for the block (Example: `12345`)
  - `base_type`: String — Base type of the block (always "Block") (Example: `Block`)
  - `title`: String or Null — Block title (Example: `Interesting Article`)
  - `description`: [MarkdownContent](#referenced-schemas-markdowncontent) or Null — Block description with multiple renderings
  - `state`: [BlockState](#referenced-schemas-blockstate)
  - `visibility`: [BlockVisibility](#referenced-schemas-blockvisibility)
  - `comment_count`: Integer — Number of comments on the block (Example: `5`)
  - `created_at`: String (date-time) — When the block was created (Example: `2023-01-15T10:30:00Z`)
  - `updated_at`: String (date-time) — When the block was last updated (Example: `2023-01-15T14:45:00Z`)
  - `user`: [EmbeddedUser](#referenced-schemas-embeddeduser)
  - `source`: [BlockSource](#referenced-schemas-blocksource) or Null — Source URL and metadata (if block was created from a URL)
  - `_links`: [Links](#referenced-schemas-links)
  - `connection`: [EmbeddedConnection](#referenced-schemas-embeddedconnection) or Null — Connection context (only present when block is returned as part of channel contents).
Contains position, pinned status, and information about who connected the block.

  - `can`: [BlockAbilities](#referenced-schemas-blockabilities) or Null — Abilities object (only present for full block responses, not in channel contents).
Indicates what actions the current user can perform on this block.

##### Block

<a id="referenced-schemas-block"></a>

  A block is a piece of content on Are.na. Blocks come in different types,
each with its own set of fields. Use the `type` field to determine which
fields are available.

  - [TextBlock](#referenced-schemas-textblock) or [ImageBlock](#referenced-schemas-imageblock) or [LinkBlock](#referenced-schemas-linkblock) or [AttachmentBlock](#referenced-schemas-attachmentblock) or [EmbedBlock](#referenced-schemas-embedblock) or [PendingBlock](#referenced-schemas-pendingblock)

**Used in:** [2.1.1 Response 201 (createBlock)](#2-1-1-block) or [2.3.1 Response 200 (getBlock)](#2-3-1-block) or [2.4.1 Response 200 (updateBlock)](#2-4-1-block)

##### BlockAbilities

<a id="referenced-schemas-blockabilities"></a>

  Actions the current user can perform on the block
  - `manage`: Boolean — Whether the user can manage (update/delete) this block (Example: `true`)
  - `comment`: Boolean — Whether the user can comment on this block (Example: `true`)
  - `connect`: Boolean — Whether the user can connect this block to channels (Example: `true`)

##### BlockAttachment

<a id="referenced-schemas-blockattachment"></a>

  - `filename`: String or Null — Attachment filename (Example: `document.pdf`)
  - `content_type`: String or Null — Attachment content type (Example: `application/pdf`)
  - `file_size`: Integer or Null — File size in bytes (Example: `2048000`)
  - `file_extension`: String or Null — File extension (Example: `pdf`)
  - `updated_at`: String or Null (date-time) — When the attachment was last updated
  - `url`: String (uri) — Attachment download URL (Example: `https://attachments.are.na/12345/document.pdf`)

##### BlockEmbed

<a id="referenced-schemas-blockembed"></a>

  - `url`: String or Null (uri) — Embed URL (Example: `https://www.youtube.com/embed/abc123`)
  - `type`: String or Null — Embed type (Example: `youtube`)
  - `title`: String or Null — Embed title (Example: `Video Title`)
  - `author_name`: String or Null — Author name (Example: `Author Name`)
  - `author_url`: String or Null (uri) — Author URL (Example: `https://example.com/author`)
  - `source_url`: String or Null (uri) — Embed source URL (Example: `https://www.youtube.com/watch?v=abc123`)
  - `width`: Integer or Null — Embed width (Example: `640`)
  - `height`: Integer or Null — Embed height (Example: `480`)
  - `html`: String or Null — Embed HTML (Example: `<iframe src='...'></iframe>`)
  - `thumbnail_url`: String or Null (uri) — Thumbnail URL (Example: `https://example.com/thumbnail.jpg`)

##### BlockImage

<a id="referenced-schemas-blockimage"></a>

  - `alt_text`: String or Null — Alternative text associated with the image (Example: `Scanned collage of magazine cutouts`)
  - `blurhash`: String or Null — BlurHash representation of the image for progressive loading (Example: `LEHV6nWB2yk8pyo0adR*.7kCMdnj`)
  - `width`: Integer or Null — Original image width in pixels (Example: `1920`)
  - `height`: Integer or Null — Original image height in pixels (Example: `1080`)
  - `src`: String (uri) — URL to the original image (Example: `https://d2w9rnfcy7mm78.cloudfront.net/12345/original_image.jpg`)
  - `aspect_ratio`: Number or Null (float) — Image aspect ratio (width / height) (Example: `1.7778`)
  - `content_type`: String — Image content type (Example: `image/jpeg`)
  - `filename`: String — Image filename (Example: `image.jpg`)
  - `file_size`: Integer or Null — File size in bytes (Example: `1024000`)
  - `updated_at`: String (date-time) — When the image was last updated (Example: `2023-01-15T14:45:00Z`)
  - `small`: [ImageVersion](#referenced-schemas-imageversion)
  - `medium`: [ImageVersion](#referenced-schemas-imageversion)
  - `large`: [ImageVersion](#referenced-schemas-imageversion)
  - `square`: [ImageVersion](#referenced-schemas-imageversion)

##### BlockInput

<a id="referenced-schemas-blockinput"></a>

  Input fields for creating a block
  - `value`: String — The content to create a block from. Can be either:
- A URL (creates Image, Link, or Embed block based on content type)
- Text/markdown content (creates a Text block)
 (Example: `https://example.com/image.jpg`)
  - `title`: String — Optional title for the block (Example: `My Block Title`)
  - `description`: String — Optional description (supports markdown) (Example: `A description of this block`)
  - `original_source_url`: String (uri) — Original source URL for attribution (Example: `https://pinterest.com/pin/123`)
  - `original_source_title`: String — Title of the original source (Example: `Pinterest`)
  - `alt_text`: String — Alt text for images (accessibility) (Example: `A photo of a sunset`)

##### BlockProvider

<a id="referenced-schemas-blockprovider"></a>

  - `name`: String — Provider name (from parsed URI host) (Example: `Example.com`)
  - `url`: String (uri) — Provider URL (from parsed URI scheme and host) (Example: `https://example.com`)

##### BlockSource

<a id="referenced-schemas-blocksource"></a>

  - `url`: String (uri) — Source URL (Example: `https://example.com/article`)
  - `title`: String or Null — Source title (Example: `Original Article Title`)
  - `provider`: [BlockProvider](#referenced-schemas-blockprovider) or Null

##### BlockState

<a id="referenced-schemas-blockstate"></a>

  Processing state of a block.
- `processing`: Being processed (e.g., image resizing)
- `available`: Ready for display
- `failed`: Processing failed

  - `processing`
  - `available`
  - `failed`

##### BlockVisibility

<a id="referenced-schemas-blockvisibility"></a>

  Visibility of a block.
- `public`: Visible to everyone
- `private`: Only visible to owner
- `orphan`: Not connected to any channel

  - `public`
  - `private`
  - `orphan`

##### BulkBlockResponse

<a id="referenced-schemas-bulkblockresponse"></a>

  Response from bulk block creation
  - `data`: Object
    - `successful`: List of Object (block: [Block](#referenced-schemas-block)) — Blocks that were created successfully
    - `failed`: List of Object — Blocks that failed to create
  - `meta`: Object
    - `total`: Integer — Total number of blocks in the request
    - `successful_count`: Integer — Number of blocks created successfully
    - `failed_count`: Integer — Number of blocks that failed to create

**Used in:** [2.2.1 Response 201 (bulkCreateBlocks)](#2-2-1-bulkblockresponse) or [2.2.2 Response 207 (bulkCreateBlocks)](#2-2-2-bulkblockresponse)

##### Channel

<a id="referenced-schemas-channel"></a>

  - `id`: Integer — Unique identifier for the channel (Example: `12345`)
  - `type`: String — Channel type (Example: `Channel`)
  - `slug`: String — Channel URL slug (Example: `my-collection-abc123`)
  - `title`: String — Channel title (Example: `My Collection`)
  - `description`: [MarkdownContent](#referenced-schemas-markdowncontent) or Null — Channel description with multiple renderings
  - `state`: [ChannelState](#referenced-schemas-channelstate)
  - `visibility`: [ChannelVisibility](#referenced-schemas-channelvisibility)
  - `created_at`: String (date-time) — When the channel was created (Example: `2023-01-15T10:30:00Z`)
  - `updated_at`: String (date-time) — When the channel was last updated (Example: `2023-01-15T14:45:00Z`)
  - `owner`: [ChannelOwner](#referenced-schemas-channelowner)
  - `counts`: [ChannelCounts](#referenced-schemas-channelcounts)
  - `_links`: [Links](#referenced-schemas-links) and Object
  - `connection`: [EmbeddedConnection](#referenced-schemas-embeddedconnection) or Null — Connection context (only present when channel is returned as part of another channel's contents).
Contains position, pinned status, and information about who connected the channel.

  - `can`: [ChannelAbilities](#referenced-schemas-channelabilities) or Null — Actions the current user can perform on this channel.
Only present when channel is returned as a full resource, not when embedded.

**Used in:** [3.1.1 Response 201 (createChannel)](#3-1-1-channel) or [3.2.1 Response 200 (getChannel)](#3-2-1-channel) or [3.3.1 Response 200 (updateChannel)](#3-3-1-channel)

##### ChannelAbilities

<a id="referenced-schemas-channelabilities"></a>

  Actions the current user can perform on the channel
  - `add_to`: Boolean — Whether the user can add blocks to this channel (Example: `true`)
  - `update`: Boolean — Whether the user can update this channel (Example: `false`)
  - `destroy`: Boolean — Whether the user can delete this channel (Example: `false`)
  - `manage_collaborators`: Boolean — Whether the user can add/remove collaborators (Example: `false`)

##### ChannelContentSort

<a id="referenced-schemas-channelcontentsort"></a>

  Sort order for channel contents.
- `position_asc`: Manual order (default)
- `position_desc`: Manual order, reversed
- `created_at_desc`: Newest first
- `created_at_asc`: Oldest first
- `updated_at_desc`: Recently updated first
- `updated_at_asc`: Least recently updated first

  - `position_asc`
  - `position_desc`
  - `created_at_asc`
  - `created_at_desc`
  - `updated_at_asc`
  - `updated_at_desc`

##### ChannelCounts

<a id="referenced-schemas-channelcounts"></a>

  Counts of various items in the channel
  - `blocks`: Integer — Number of blocks in the channel (Example: `42`)
  - `channels`: Integer — Number of channels connected to this channel (Example: `8`)
  - `contents`: Integer — Total number of contents (blocks + channels) (Example: `50`)
  - `collaborators`: Integer — Number of collaborators on the channel (Example: `3`)

##### ChannelIds

<a id="referenced-schemas-channelids"></a>

  Array of channel IDs or slugs. Accepts numeric IDs, string IDs, or
channel slugs (e.g., `[123, "456", "my-channel-slug"]`).

  - **Example**: `[123,"my-channel"]`

##### ChannelList

<a id="referenced-schemas-channellist"></a>

  Data payload containing an array of channels
  - `data`: List of [Channel](#referenced-schemas-channel) — Array of channels

##### ChannelListResponse

<a id="referenced-schemas-channellistresponse"></a>

  Paginated list of channels with total count
  - [ChannelList](#referenced-schemas-channellist) and [PaginatedResponse](#referenced-schemas-paginatedresponse)

**Used in:** [2.5.3 Response 200 (getBlockConnections)](#2-5-3-channellistresponse) or [3.6.2 Response 200 (getChannelConnections)](#3-6-2-channellistresponse)

##### ChannelOwner

<a id="referenced-schemas-channelowner"></a>

  Channel owner (User or Group)
  - [EmbeddedUser](#referenced-schemas-embeddeduser) or [EmbeddedGroup](#referenced-schemas-embeddedgroup)

##### ChannelState

<a id="referenced-schemas-channelstate"></a>

  Lifecycle state of a channel.
- `available`: Active and accessible
- `deleted`: Soft deleted

  - `available`
  - `deleted`

##### ChannelVisibility

<a id="referenced-schemas-channelvisibility"></a>

  Visibility level of a channel:
- `public`: Anyone can view and connect to the channel
- `private`: Only the owner and collaborators can view
- `closed`: Anyone can view, but only collaborators can add content

  - `public`
  - `private`
  - `closed`

##### Comment

<a id="referenced-schemas-comment"></a>

  A comment on a block
  - `id`: Integer — Unique identifier for the comment (Example: `12345`)
  - `type`: String — Comment type (Example: `Comment`)
  - `body`: [MarkdownContent](#referenced-schemas-markdowncontent) or Null — Comment body with markdown, HTML, and plain text renderings
  - `created_at`: String (date-time) — When the comment was created (Example: `2023-01-15T10:30:00Z`)
  - `updated_at`: String (date-time) — When the comment was last updated (Example: `2023-01-15T14:45:00Z`)
  - `user`: [EmbeddedUser](#referenced-schemas-embeddeduser)
  - `_links`: [Links](#referenced-schemas-links) and Object

##### CommentList

<a id="referenced-schemas-commentlist"></a>

  Data payload containing an array of comments
  - `data`: List of [Comment](#referenced-schemas-comment) — Array of comments

##### CommentListResponse

<a id="referenced-schemas-commentlistresponse"></a>

  Paginated list of comments with total count
  - [CommentList](#referenced-schemas-commentlist) and [PaginatedResponse](#referenced-schemas-paginatedresponse)

##### ConnectableList

<a id="referenced-schemas-connectablelist"></a>

  Data payload containing mixed content that can be connected to channels (blocks and channels)
  - `data`: List of [TextBlock](#referenced-schemas-textblock) or [ImageBlock](#referenced-schemas-imageblock) or [LinkBlock](#referenced-schemas-linkblock) or [AttachmentBlock](#referenced-schemas-attachmentblock) or [EmbedBlock](#referenced-schemas-embedblock) or [Channel](#referenced-schemas-channel) — Array of blocks and channels

##### ConnectableListResponse

<a id="referenced-schemas-connectablelistresponse"></a>

  Paginated list of connectable content (blocks and channels)
  - [ConnectableList](#referenced-schemas-connectablelist) and [PaginatedResponse](#referenced-schemas-paginatedresponse)

**Used in:** [3.5.2 Response 200 (getChannelContents)](#3-5-2-connectablelistresponse) or [6.2.3 Response 200 (getGroupContents)](#6-2-3-connectablelistresponse) or [9.3.3 Response 200 (getUserContents)](#9-3-3-connectablelistresponse)

##### ConnectableType

<a id="referenced-schemas-connectabletype"></a>

  Type of entity that can be connected to a channel.
- `Block`: A block
- `Channel`: A channel

  - `Block`
  - `Channel`

##### Connection

<a id="referenced-schemas-connection"></a>

  Full connection resource with abilities and links.
Used for GET /v3/connections/:id

  - [EmbeddedConnection](#referenced-schemas-embeddedconnection) and Object
    - `can`: [ConnectionAbilities](#referenced-schemas-connectionabilities)
    - `_links`: [Links](#referenced-schemas-links)

**Used in:** [5.2.1 Response 200 (getConnection)](#5-2-1-connection) or [5.4.1 Response 200 (moveConnection)](#5-4-1-connection)

##### ConnectionAbilities

<a id="referenced-schemas-connectionabilities"></a>

  Actions the current user can perform on this connection
  - `remove`: Boolean — Whether the user can remove this connection (Example: `true`)

##### ConnectionFilter

<a id="referenced-schemas-connectionfilter"></a>

  Filter connections by who created them.
- `ALL`: All connections (default)
- `OWN`: Only connections by the current user
- `EXCLUDE_OWN`: Exclude connections by the current user

  - `ALL`
  - `OWN`
  - `EXCLUDE_OWN`

##### ConnectionSort

<a id="referenced-schemas-connectionsort"></a>

  Sort order for relationship lists.
- `created_at_desc`: Newest first (default)
- `created_at_asc`: Oldest first

  - `created_at_desc`
  - `created_at_asc`

**Used in:** [2.5.1 Parameter: sort (query) (getBlockConnections)](#2-5-1-connectionsort) or [2.6.1 Parameter: sort (query) (getBlockComments)](#2-6-1-connectionsort) or [3.6.1 Parameter: sort (query) (getChannelConnections)](#3-6-1-connectionsort) or [3.7.1 Parameter: sort (query) (getChannelFollowers)](#3-7-1-connectionsort) or [6.3.1 Parameter: sort (query) (getGroupFollowers)](#6-3-1-connectionsort) or [9.4.1 Parameter: sort (query) (getUserFollowers)](#9-4-1-connectionsort) or [9.5.1 Parameter: sort (query) (getUserFollowing)](#9-5-1-connectionsort)

##### ContentSort

<a id="referenced-schemas-contentsort"></a>

  Sort order for user or group content.
- `created_at_desc`: Newest first (default)
- `created_at_asc`: Oldest first
- `updated_at_desc`: Recently updated first
- `updated_at_asc`: Least recently updated first

  - `created_at_asc`
  - `created_at_desc`
  - `updated_at_asc`
  - `updated_at_desc`

**Used in:** [6.2.1 Parameter: sort (query) (getGroupContents)](#6-2-1-contentsort) or [9.3.1 Parameter: sort (query) (getUserContents)](#9-3-1-contentsort)

##### ContentTypeFilter

<a id="referenced-schemas-contenttypefilter"></a>

  Filter by content type.
- `Text`: Text blocks
- `Image`: Image blocks
- `Link`: Link blocks
- `Attachment`: File attachments
- `Embed`: Embedded media (video, audio, etc.)
- `Channel`: Channels only
- `Block`: All block types (excludes channels)

  - `Text`
  - `Image`
  - `Link`
  - `Attachment`
  - `Embed`
  - `Channel`
  - `Block`

**Used in:** [6.2.2 Parameter: type (query) (getGroupContents)](#6-2-2-contenttypefilter) or [9.3.2 Parameter: type (query) (getUserContents)](#9-3-2-contenttypefilter)

##### EmbedBlock

<a id="referenced-schemas-embedblock"></a>

  An embed block containing embedded media (video, audio, etc.)
  - [BaseBlockProperties](#referenced-schemas-baseblockproperties) and Object
    - `type`: String — Block type (always "Embed" for EmbedBlock)
    - `embed`: [BlockEmbed](#referenced-schemas-blockembed)
    - `image`: [BlockImage](#referenced-schemas-blockimage) or Null — Thumbnail image (if available)

##### EmbeddedConnection

<a id="referenced-schemas-embeddedconnection"></a>

  Embedded connection representation used when connection is nested in other resources
  - `id`: Integer — Unique identifier for the connection (Example: `98765`)
  - `position`: Integer — Position of the item within the channel (Example: `1`)
  - `pinned`: Boolean — Whether the item is pinned (Example: `false`)
  - `connected_at`: String (date-time) — When the item was connected (Example: `2023-01-15T10:30:00Z`)
  - `connected_by`: [EmbeddedUser](#referenced-schemas-embeddeduser) or Null — User who created this connection

##### EmbeddedGroup

<a id="referenced-schemas-embeddedgroup"></a>

  Embedded group representation (used when group is nested in other resources)
  - `id`: Integer — Unique identifier for the group (Example: `67890`)
  - `type`: String — Group type (Example: `Group`)
  - `name`: String — Group's name (Example: `Design Team`)
  - `slug`: String — Group's URL slug (Example: `design-team-abc123`)
  - `avatar`: String or Null (uri) — URL to group's avatar image (Example: `https://d2w9rnfcy7mm78.cloudfront.net/groups/67890/avatar.jpg`)
  - `initials`: String — Group's initials (Example: `DT`)

##### EmbeddedUser

<a id="referenced-schemas-embeddeduser"></a>

  Embedded user representation (used when user is nested in other resources)
  - `id`: Integer — Unique identifier for the user (Example: `12345`)
  - `type`: String — User type (Example: `User`)
  - `name`: String — User's display name (Example: `John Doe`)
  - `slug`: String — URL-safe identifier (use this in API paths) (Example: `john-doe`)
  - `avatar`: String or Null (uri) — URL to user's avatar image (Example: `https://d2w9rnfcy7mm78.cloudfront.net/12345/avatar.jpg`)
  - `initials`: String — User's initials (Example: `JD`)

##### Error

<a id="referenced-schemas-error"></a>

  - `error`: String — Error message (Example: `Not Found`)
  - `code`: Integer — HTTP status code (Example: `404`)
  - `details`: Object — Additional error details
    - `message`: String — Detailed error message (Example: `The resource you are looking for does not exist.`)

**Used in:** [2.1.2 Response 403 (createBlock)](#2-1-2-error) or [2.2.3 Response 403 (bulkCreateBlocks)](#2-2-3-error) or [7.1.4 Response 403 (search)](#7-1-4-error)

##### EverythingList

<a id="referenced-schemas-everythinglist"></a>

  Data payload containing all content types
  - `data`: List of [TextBlock](#referenced-schemas-textblock) or [ImageBlock](#referenced-schemas-imageblock) or [LinkBlock](#referenced-schemas-linkblock) or [AttachmentBlock](#referenced-schemas-attachmentblock) or [EmbedBlock](#referenced-schemas-embedblock) or [Channel](#referenced-schemas-channel) or [User](#referenced-schemas-user) or [Group](#referenced-schemas-group) — Array of results (blocks, channels, users, or groups)

##### EverythingListResponse

<a id="referenced-schemas-everythinglistresponse"></a>

  Paginated list of all content types with total count
  - [EverythingList](#referenced-schemas-everythinglist) and [PaginatedResponse](#referenced-schemas-paginatedresponse)

##### FileExtension

<a id="referenced-schemas-fileextension"></a>

  File extension for filtering attachment and image blocks.
Common values: pdf, jpg, png, gif, mp4, mp3, doc, xls.

  - `aac`
  - `ai`
  - `aiff`
  - `avi`
  - `avif`
  - `bmp`
  - `csv`
  - `doc`
  - `docx`
  - `eps`
  - `epub`
  - `fla`
  - `gif`
  - `h264`
  - `heic`
  - `heif`
  - `ind`
  - `indd`
  - `jpeg`
  - `jpg`
  - `key`
  - `kml`
  - `kmz`
  - `latex`
  - `m4a`
  - `ma`
  - `mb`
  - `mid`
  - `midi`
  - `mov`
  - `mp3`
  - `mp4`
  - `mp4v`
  - `mpeg`
  - `mpg`
  - `mpg4`
  - `numbers`
  - `oga`
  - `ogg`
  - `ogv`
  - `otf`
  - `pages`
  - `pdf`
  - `pgp`
  - `png`
  - `ppt`
  - `pptx`
  - `psd`
  - `svg`
  - `swa`
  - `swf`
  - `tex`
  - `texi`
  - `texinfo`
  - `tfm`
  - `tif`
  - `tiff`
  - `torrent`
  - `ttc`
  - `ttf`
  - `txt`
  - `wav`
  - `webm`
  - `webp`
  - `wma`
  - `xls`
  - `xlsx`
  - `xlt`

##### FollowableList

<a id="referenced-schemas-followablelist"></a>

  Data payload containing followable items (users, channels, and groups)
  - `data`: List of [User](#referenced-schemas-user) or [Channel](#referenced-schemas-channel) or [Group](#referenced-schemas-group) — Array of users, channels, and/or groups

##### FollowableListResponse

<a id="referenced-schemas-followablelistresponse"></a>

  Paginated list of followable items (users, channels, and groups) with total count
  - [FollowableList](#referenced-schemas-followablelist) and [PaginatedResponse](#referenced-schemas-paginatedresponse)

##### FollowableType

<a id="referenced-schemas-followabletype"></a>

  Type of entity that can be followed.
- `User`: A user
- `Channel`: A channel
- `Group`: A group

  - `User`
  - `Channel`
  - `Group`

##### Group

<a id="referenced-schemas-group"></a>

  Full group representation
  - [EmbeddedGroup](#referenced-schemas-embeddedgroup) and Object
    - `bio`: [MarkdownContent](#referenced-schemas-markdowncontent) or Null — Group biography with markdown, HTML, and plain text renderings
    - `created_at`: String (date-time) — When the group was created (Example: `2023-01-15T10:30:00Z`)
    - `updated_at`: String (date-time) — When the group was last updated (Example: `2023-06-20T14:45:00Z`)
    - `user`: [EmbeddedUser](#referenced-schemas-embeddeduser)
    - `counts`: [GroupCounts](#referenced-schemas-groupcounts)
    - `_links`: [Links](#referenced-schemas-links)

##### GroupCounts

<a id="referenced-schemas-groupcounts"></a>

  Counts of various items for the group
  - `channels`: Integer — Number of channels owned by the group (Example: `12`)
  - `users`: Integer — Number of users in the group (Example: `5`)

##### ImageBlock

<a id="referenced-schemas-imageblock"></a>

  An image block containing an uploaded or scraped image
  - [BaseBlockProperties](#referenced-schemas-baseblockproperties) and Object
    - `type`: String — Block type (always "Image" for ImageBlock)
    - `image`: [BlockImage](#referenced-schemas-blockimage)

##### ImageVersion

<a id="referenced-schemas-imageversion"></a>

  A resized/processed version of an image with multiple resolution URLs
  - `src`: String (uri) — Default image URL (1x resolution) (Example: `https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image.jpg`)
  - `src_2x`: String (uri) — 2x resolution image URL for high DPI displays (Example: `https://d2w9rnfcy7mm78.cloudfront.net/12345/display_image@2x.jpg`)
  - `width`: Integer or Null — Width of the resized image in pixels (Example: `640`)
  - `height`: Integer or Null — Height of the resized image in pixels (Example: `480`)

##### Link

<a id="referenced-schemas-link"></a>

  A hypermedia link containing the URL of a linked resource.
The relationship type is expressed by the key in the parent _links object.

  - `href`: String (uri) — The URL of the linked resource (Example: `https://api.are.na/v3/blocks/12345`)

##### LinkBlock

<a id="referenced-schemas-linkblock"></a>

  A link block representing a URL with optional preview
  - [BaseBlockProperties](#referenced-schemas-baseblockproperties) and Object
    - `type`: String — Block type (always "Link" for LinkBlock)
    - `image`: [BlockImage](#referenced-schemas-blockimage) or Null — Preview image (if available)
    - `content`: [MarkdownContent](#referenced-schemas-markdowncontent) or Null — Extracted text content from the link

##### Links

<a id="referenced-schemas-links"></a>

  HATEOAS links for navigation and discovery.
Follows HAL (Hypertext Application Language) format where link relationships 
are expressed as object keys (e.g., "self", "user", "channels").

  - `self`: [Link](#referenced-schemas-link)
  - **Additional properties:** values must be [Link](#referenced-schemas-link)

##### MarkdownContent

<a id="referenced-schemas-markdowncontent"></a>

  Markdown content with multiple renderings
  - `markdown`: String — Original markdown value (Example: `This is **only** a [test](https://example.com).`)
  - `html`: String — HTML rendering of the markdown (Example: `<p>This is <strong>only</strong> a <a href=\"https://example.com\" target=\"_blank\" rel=\"nofollow noopener\">test</a>.</p>`)
  - `plain`: String — Plain text rendering of the markdown (Example: `This is only a test (https://example.com).`)

##### Movement

<a id="referenced-schemas-movement"></a>

  Movement action for repositioning a connection within a channel.
"Top" refers to the visually first position (newest items appear at the top).
- `insert_at`: Move to a specific position (requires `position` parameter)
- `move_to_top`: Move to the visually first position
- `move_to_bottom`: Move to the visually last position
- `move_up`: Move one position up (towards the top)
- `move_down`: Move one position down (towards the bottom)

  - `insert_at`
  - `move_to_top`
  - `move_to_bottom`
  - `move_up`
  - `move_down`

##### PaginatedResponse

<a id="referenced-schemas-paginatedresponse"></a>

  Base schema for all paginated responses (use allOf to extend with specific data type)
  - `meta`: [PaginationMeta](#referenced-schemas-paginationmeta)

##### PaginationMeta

<a id="referenced-schemas-paginationmeta"></a>

  Pagination metadata
  - `current_page`: Integer — Current page number (Example: `1`)
  - `next_page`: Integer or Null — Next page number (null if last page) (Example: `2`)
  - `prev_page`: Integer or Null — Previous page number (null if first page)
  - `per_page`: Integer — Number of items per page (Example: `25`)
  - `total_pages`: Integer — Total number of pages available (Example: `5`)
  - `total_count`: Integer — Total number of items available (Example: `120`)
  - `has_more_pages`: Boolean — Whether there are more pages available (Example: `true`)

##### PendingBlock

<a id="referenced-schemas-pendingblock"></a>

  A block that is currently being processed. The final type (Text, Image, Link, etc.)
will be determined once processing completes. Check the `state` field for processing status.

  - [BaseBlockProperties](#referenced-schemas-baseblockproperties) and Object
    - `type`: String — Block type (always "PendingBlock" for blocks being processed)

##### PingResponse

<a id="referenced-schemas-pingresponse"></a>

  Health check response
  - `status`: String (Example: `ok`)

##### RateLimitError

<a id="referenced-schemas-ratelimiterror"></a>

  Rate limit exceeded error response with upgrade information and suggestions
  - `error`: Object
    - `type`: String — Error type identifier (Example: `rate_limit_exceeded`)
    - `message`: String — Human-readable error message (Example: `Rate limit of 30 requests per minute exceeded for guest tier. Try again later.`)
    - `tier`: [UserTier](#referenced-schemas-usertier)
    - `limit`: Integer — Request limit per minute for this tier (Example: `30`)
    - `limit_window`: String — Time window for rate limits (Example: `1 minute`)
    - `retry_after`: Integer — Suggested seconds to wait before retrying (Example: `65`)
    - `current_status`: Object
      - `tier`: String (Example: `guest`)
      - `limits`: Object (Example: `{"guest":30,"free":120,"premium":300,"supporter":600}`)
      - `upgrade_path`: Object
        - `current`: String (Example: `Guest (30 req/min)`)
        - `recommended`: String (Example: `Free Account (120 req/min)`)
        - `benefits`: List of String (Example: `["4x higher rate limit","Persistent authentication","API access"]`)
        - `action`: String (Example: `Sign up at https://are.na/signup`)
    - `suggestions`: List of String — Tier-specific optimization suggestions (Example: `["Sign up for a free account to get 120 requests per minute","Implement exponential backoff with jitter","Cache responses when possible to reduce API calls","Consider batch requests if available"]`)
    - `headers_note`: String — Information about header usage (Example: `Check 'X-RateLimit-*' headers on successful requests for current usage`)

##### SearchScope

<a id="referenced-schemas-searchscope"></a>

  Limit search to a specific context.
- `all`: Everything accessible to the user (default)
- `my`: Only the current user's own content
- `following`: Content from followed users and channels

  - `all`
  - `my`
  - `following`

##### SearchSort

<a id="referenced-schemas-searchsort"></a>

  Sort order for search results.
- `score_desc`: Most relevant first (default)
- `created_at_desc`: Newest first
- `created_at_asc`: Oldest first
- `updated_at_desc`: Recently updated first
- `updated_at_asc`: Least recently updated first
- `name_asc`: Alphabetical A-Z
- `name_desc`: Alphabetical Z-A
- `connections_count_desc`: Most connected first
- `random`: Random (use `seed` for reproducibility)

  - `score_desc`
  - `created_at_desc`
  - `created_at_asc`
  - `updated_at_desc`
  - `updated_at_asc`
  - `name_asc`
  - `name_desc`
  - `connections_count_desc`
  - `random`

##### SearchTypeFilter

<a id="referenced-schemas-searchtypefilter"></a>

  Filter by content type. Includes users and groups.
- `All`: Everything (default)
- `Text`, `Image`, `Link`, `Attachment`, `Embed`: Block types
- `Block`: All block types
- `Channel`: Channels only
- `User`: Users only
- `Group`: Groups only

  - `All`
  - `Text`
  - `Image`
  - `Link`
  - `Attachment`
  - `Embed`
  - `Channel`
  - `Block`
  - `User`
  - `Group`

##### TextBlock

<a id="referenced-schemas-textblock"></a>

  A text block containing markdown content
  - [BaseBlockProperties](#referenced-schemas-baseblockproperties) and Object
    - `type`: String — Block type (always "Text" for TextBlock)
    - `content`: [MarkdownContent](#referenced-schemas-markdowncontent)

##### User

<a id="referenced-schemas-user"></a>

  Full user representation
  - [EmbeddedUser](#referenced-schemas-embeddeduser) and Object
    - `created_at`: String (date-time) — When the user was created (Example: `2023-01-15T10:30:00Z`)
    - `updated_at`: String (date-time) — When the user was last updated (Example: `2023-06-20T14:45:00Z`)
    - `bio`: [MarkdownContent](#referenced-schemas-markdowncontent) or Null — User biography with markdown, HTML, and plain text renderings
    - `counts`: [UserCounts](#referenced-schemas-usercounts)
    - `_links`: [Links](#referenced-schemas-links)

**Used in:** [9.1.1 Response 200 (getCurrentUser)](#9-1-1-user) or [9.2.1 Response 200 (getUser)](#9-2-1-user)

##### UserCounts

<a id="referenced-schemas-usercounts"></a>

  Counts of various items for the user
  - `channels`: Integer — Number of channels owned by the user (Example: `24`)
  - `followers`: Integer — Number of followers (Example: `156`)
  - `following`: Integer — Number of users being followed (Example: `89`)

##### UserList

<a id="referenced-schemas-userlist"></a>

  Data payload containing an array of users
  - `data`: List of [User](#referenced-schemas-user) — Array of users

##### UserListResponse

<a id="referenced-schemas-userlistresponse"></a>

  Paginated list of users with total count
  - [UserList](#referenced-schemas-userlist) and [PaginatedResponse](#referenced-schemas-paginatedresponse)

**Used in:** [3.7.2 Response 200 (getChannelFollowers)](#3-7-2-userlistresponse) or [6.3.2 Response 200 (getGroupFollowers)](#6-3-2-userlistresponse) or [9.4.2 Response 200 (getUserFollowers)](#9-4-2-userlistresponse)

##### UserTier

<a id="referenced-schemas-usertier"></a>

  User subscription tier:
- `guest`: Unauthenticated user
- `free`: Free account
- `premium`: Premium subscriber
- `supporter`: Supporter tier

  - `guest`
  - `free`
  - `premium`
  - `supporter`


