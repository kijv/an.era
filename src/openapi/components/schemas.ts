import * as v from 'valibot';

export type Error = {
  error: string;
  code: number;
  details?: { message?: string };
};
export type RateLimitError = {
  error: {
    type: string;
    message: string;
    tier: 'guest' | 'free' | 'premium' | 'supporter';
    limit: number;
    limit_window?: string;
    retry_after: number;
    current_status?: {
      tier?: string;
      limits?: {};
      upgrade_path?: {
        current?: string;
        recommended?: string;
        benefits?: string[];
        action?: string;
      };
    };
    suggestions: string[];
    headers_note?: string;
  };
};
export type Link = { href: string };
export type MarkdownContent = { markdown: string; html: string; plain: string };
export type EmbeddedUser = {
  id: number;
  type: 'User';
  name: string;
  slug: string;
  avatar: any;
  initials: string;
};
export type EmbeddedGroup = {
  id: number;
  type: 'Group';
  name: string;
  slug: string;
  avatar: any;
  initials: string;
};
export type UserCounts = {
  channels: number;
  followers: number;
  following: number;
};
export type GroupCounts = { channels: number; users: number };
export type ContentTypeFilter =
  | 'Text'
  | 'Image'
  | 'Link'
  | 'Attachment'
  | 'Embed'
  | 'Channel'
  | 'Block';
export type SearchTypeFilter =
  | 'All'
  | 'Text'
  | 'Image'
  | 'Link'
  | 'Attachment'
  | 'Embed'
  | 'Channel'
  | 'Block'
  | 'User'
  | 'Group';
export type FileExtension =
  | 'aac'
  | 'ai'
  | 'aiff'
  | 'avi'
  | 'avif'
  | 'bmp'
  | 'csv'
  | 'doc'
  | 'docx'
  | 'eps'
  | 'epub'
  | 'fla'
  | 'gif'
  | 'h264'
  | 'heic'
  | 'heif'
  | 'ind'
  | 'indd'
  | 'jpeg'
  | 'jpg'
  | 'key'
  | 'kml'
  | 'kmz'
  | 'latex'
  | 'm4a'
  | 'ma'
  | 'mb'
  | 'mid'
  | 'midi'
  | 'mov'
  | 'mp3'
  | 'mp4'
  | 'mp4v'
  | 'mpeg'
  | 'mpg'
  | 'mpg4'
  | 'numbers'
  | 'oga'
  | 'ogg'
  | 'ogv'
  | 'otf'
  | 'pages'
  | 'pdf'
  | 'pgp'
  | 'png'
  | 'ppt'
  | 'pptx'
  | 'psd'
  | 'svg'
  | 'swa'
  | 'swf'
  | 'tex'
  | 'texi'
  | 'texinfo'
  | 'tfm'
  | 'tif'
  | 'tiff'
  | 'torrent'
  | 'ttc'
  | 'ttf'
  | 'txt'
  | 'wav'
  | 'webm'
  | 'webp'
  | 'wma'
  | 'xls'
  | 'xlsx'
  | 'xlt';
export type ConnectionSort = 'created_at_desc' | 'created_at_asc';
export type ChannelContentSort =
  | 'position_asc'
  | 'position_desc'
  | 'created_at_asc'
  | 'created_at_desc'
  | 'updated_at_asc'
  | 'updated_at_desc';
export type ContentSort =
  | 'created_at_asc'
  | 'created_at_desc'
  | 'updated_at_asc'
  | 'updated_at_desc';
export type ChannelVisibility = 'public' | 'private' | 'closed';
export type BlockProvider = { name: string; url: string };
export type ImageVersion = {
  src: string;
  src_1x: string;
  src_2x: string;
  width?: any;
  height?: any;
};
export type BlockEmbed = {
  url?: any;
  type?: any;
  title?: any;
  author_name?: any;
  author_url?: any;
  source_url?: any;
  width?: any;
  height?: any;
  html?: any;
  thumbnail_url?: any;
};
export type BlockAttachment = {
  filename?: any;
  content_type?: any;
  file_size?: any;
  file_extension?: any;
  updated_at?: any;
  url: string;
};
export type ChannelAbilities = {
  add_to: boolean;
  update: boolean;
  destroy: boolean;
  manage_collaborators: boolean;
};
export type ChannelCounts = {
  blocks: number;
  channels: number;
  contents: number;
  collaborators: number;
};
export type PaginationMetaWithCount = {
  current_page: number;
  next_page?: any;
  prev_page?: any;
  per_page: number;
  total_pages: number;
  total_count: number;
  has_more_pages: boolean;
};
export type PaginationMetaWithoutCount = {
  current_page: number;
  next_page?: any;
  prev_page?: any;
  per_page: number;
  has_more_pages: boolean;
};
export type PingResponse = { status: 'ok' };
export type Links = { self: { href: string } };
export type ConnectionContext = {
  id: number;
  position: number;
  pinned: boolean;
  connected_at: string;
  connected_by: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  } | null;
};
export type ChannelOwner =
  | {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    }
  | {
      id: number;
      type: 'Group';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    };
export type BlockSource = {
  url: string;
  title?: any;
  provider?: { name: string; url: string } | null;
};
export type BlockImage = {
  alt_text?: any;
  blurhash?: any;
  width?: any;
  height?: any;
  aspect_ratio?: any;
  content_type?: string;
  filename?: string;
  file_size?: any;
  updated_at?: string;
  small: {
    src: string;
    src_1x: string;
    src_2x: string;
    width?: any;
    height?: any;
  };
  medium: {
    src: string;
    src_1x: string;
    src_2x: string;
    width?: any;
    height?: any;
  };
  large: {
    src: string;
    src_1x: string;
    src_2x: string;
    width?: any;
    height?: any;
  };
  square: {
    src: string;
    src_1x: string;
    src_2x: string;
    width?: any;
    height?: any;
  };
};
export type PaginatedResponseWithCountBase = {
  meta: {
    current_page: number;
    next_page?: any;
    prev_page?: any;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_more_pages: boolean;
  };
};
export type PaginationMeta =
  | {
      current_page: number;
      next_page?: any;
      prev_page?: any;
      per_page: number;
      total_pages: number;
      total_count: number;
      has_more_pages: boolean;
    }
  | {
      current_page: number;
      next_page?: any;
      prev_page?: any;
      per_page: number;
      has_more_pages: boolean;
    };
export type User = {
  id: number;
  type: 'User';
  name: string;
  slug: string;
  avatar: any;
  initials: string;
} & {
  created_at: string;
  updated_at: string;
  bio?: { markdown: string; html: string; plain: string } | null;
  counts: { channels: number; followers: number; following: number };
  _links: { self: { href: string } };
};
export type Group = {
  id: number;
  type: 'Group';
  name: string;
  slug: string;
  avatar: any;
  initials: string;
} & {
  bio?: { markdown: string; html: string; plain: string } | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  counts: { channels: number; users: number };
  _links: { self: { href: string } };
};
export type Comment = {
  id: number;
  type: 'Comment';
  body?: { markdown: string; html: string; plain: string } | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  _links: { self: { href: string } };
};
export type Channel = {
  id: number;
  type: 'Channel';
  slug: string;
  title: string;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'deleted';
  visibility: 'public' | 'private' | 'closed';
  created_at: string;
  updated_at: string;
  owner:
    | {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      }
    | {
        id: number;
        type: 'Group';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      };
  counts: {
    blocks: number;
    channels: number;
    contents: number;
    collaborators: number;
  };
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
  can: {
    add_to: boolean;
    update: boolean;
    destroy: boolean;
    manage_collaborators: boolean;
  };
};
export type BaseBlockProperties = {
  id: number;
  base_type: 'Block';
  title?: any;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'pending' | 'failed' | 'processing';
  visibility: 'public' | 'private' | 'orphan';
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  source?: {
    url: string;
    title?: any;
    provider?: { name: string; url: string } | null;
  } | null;
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
};
export type PaginatedResponseBase = {
  meta:
    | {
        current_page: number;
        next_page?: any;
        prev_page?: any;
        per_page: number;
        total_pages: number;
        total_count: number;
        has_more_pages: boolean;
      }
    | {
        current_page: number;
        next_page?: any;
        prev_page?: any;
        per_page: number;
        has_more_pages: boolean;
      };
};
export type UserList = {
  data: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  } & {
    created_at: string;
    updated_at: string;
    bio?: { markdown: string; html: string; plain: string } | null;
    counts: { channels: number; followers: number; following: number };
    _links: { self: { href: string } };
  }[];
};
export type CommentList = {
  data: {
    id: number;
    type: 'Comment';
    body?: { markdown: string; html: string; plain: string } | null;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    };
    _links: { self: { href: string } };
  }[];
};
export type ChannelList = {
  data: {
    id: number;
    type: 'Channel';
    slug: string;
    title: string;
    description?: { markdown: string; html: string; plain: string } | null;
    state: 'available' | 'deleted';
    visibility: 'public' | 'private' | 'closed';
    created_at: string;
    updated_at: string;
    owner:
      | {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        }
      | {
          id: number;
          type: 'Group';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
    counts: {
      blocks: number;
      channels: number;
      contents: number;
      collaborators: number;
    };
    _links: { self: { href: string } };
    connection?: {
      id: number;
      position: number;
      pinned: boolean;
      connected_at: string;
      connected_by: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } | null;
    } | null;
    can: {
      add_to: boolean;
      update: boolean;
      destroy: boolean;
      manage_collaborators: boolean;
    };
  }[];
};
export type FollowableList = {
  data:
    | ({
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        created_at: string;
        updated_at: string;
        bio?: { markdown: string; html: string; plain: string } | null;
        counts: { channels: number; followers: number; following: number };
        _links: { self: { href: string } };
      })
    | {
        id: number;
        type: 'Channel';
        slug: string;
        title: string;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'deleted';
        visibility: 'public' | 'private' | 'closed';
        created_at: string;
        updated_at: string;
        owner:
          | {
              id: number;
              type: 'User';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            }
          | {
              id: number;
              type: 'Group';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            };
        counts: {
          blocks: number;
          channels: number;
          contents: number;
          collaborators: number;
        };
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
        can: {
          add_to: boolean;
          update: boolean;
          destroy: boolean;
          manage_collaborators: boolean;
        };
      }
    | ({
        id: number;
        type: 'Group';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        bio?: { markdown: string; html: string; plain: string } | null;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        counts: { channels: number; users: number };
        _links: { self: { href: string } };
      }[]);
};
export type TextBlock = {
  id: number;
  base_type: 'Block';
  title?: any;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'pending' | 'failed' | 'processing';
  visibility: 'public' | 'private' | 'orphan';
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  source?: {
    url: string;
    title?: any;
    provider?: { name: string; url: string } | null;
  } | null;
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
} & {
  type: 'Text';
  content: { markdown: string; html: string; plain: string };
};
export type ImageBlock = {
  id: number;
  base_type: 'Block';
  title?: any;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'pending' | 'failed' | 'processing';
  visibility: 'public' | 'private' | 'orphan';
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  source?: {
    url: string;
    title?: any;
    provider?: { name: string; url: string } | null;
  } | null;
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
} & {
  type: 'Image';
  image: {
    alt_text?: any;
    blurhash?: any;
    width?: any;
    height?: any;
    aspect_ratio?: any;
    content_type?: string;
    filename?: string;
    file_size?: any;
    updated_at?: string;
    small: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    medium: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    large: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    square: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
  };
};
export type LinkBlock = {
  id: number;
  base_type: 'Block';
  title?: any;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'pending' | 'failed' | 'processing';
  visibility: 'public' | 'private' | 'orphan';
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  source?: {
    url: string;
    title?: any;
    provider?: { name: string; url: string } | null;
  } | null;
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
} & {
  type: 'Link';
  image?: {
    alt_text?: any;
    blurhash?: any;
    width?: any;
    height?: any;
    aspect_ratio?: any;
    content_type?: string;
    filename?: string;
    file_size?: any;
    updated_at?: string;
    small: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    medium: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    large: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    square: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
  } | null;
  content?: { markdown: string; html: string; plain: string } | null;
};
export type AttachmentBlock = {
  id: number;
  base_type: 'Block';
  title?: any;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'pending' | 'failed' | 'processing';
  visibility: 'public' | 'private' | 'orphan';
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  source?: {
    url: string;
    title?: any;
    provider?: { name: string; url: string } | null;
  } | null;
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
} & {
  type: 'Attachment';
  attachment: {
    filename?: any;
    content_type?: any;
    file_size?: any;
    file_extension?: any;
    updated_at?: any;
    url: string;
  };
  image?: {
    alt_text?: any;
    blurhash?: any;
    width?: any;
    height?: any;
    aspect_ratio?: any;
    content_type?: string;
    filename?: string;
    file_size?: any;
    updated_at?: string;
    small: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    medium: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    large: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    square: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
  } | null;
};
export type EmbedBlock = {
  id: number;
  base_type: 'Block';
  title?: any;
  description?: { markdown: string; html: string; plain: string } | null;
  state: 'available' | 'pending' | 'failed' | 'processing';
  visibility: 'public' | 'private' | 'orphan';
  comment_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  };
  source?: {
    url: string;
    title?: any;
    provider?: { name: string; url: string } | null;
  } | null;
  _links: { self: { href: string } };
  connection?: {
    id: number;
    position: number;
    pinned: boolean;
    connected_at: string;
    connected_by: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    } | null;
  } | null;
} & {
  type: 'Embed';
  embed: {
    url?: any;
    type?: any;
    title?: any;
    author_name?: any;
    author_url?: any;
    source_url?: any;
    width?: any;
    height?: any;
    html?: any;
    thumbnail_url?: any;
  };
  image?: {
    alt_text?: any;
    blurhash?: any;
    width?: any;
    height?: any;
    aspect_ratio?: any;
    content_type?: string;
    filename?: string;
    file_size?: any;
    updated_at?: string;
    small: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    medium: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    large: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
    square: {
      src: string;
      src_1x: string;
      src_2x: string;
      width?: any;
      height?: any;
    };
  } | null;
};
export type UserListResponse = {
  data: {
    id: number;
    type: 'User';
    name: string;
    slug: string;
    avatar: any;
    initials: string;
  } & {
    created_at: string;
    updated_at: string;
    bio?: { markdown: string; html: string; plain: string } | null;
    counts: { channels: number; followers: number; following: number };
    _links: { self: { href: string } };
  }[];
} & {
  meta: {
    current_page: number;
    next_page?: any;
    prev_page?: any;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_more_pages: boolean;
  };
};
export type CommentListResponse = {
  data: {
    id: number;
    type: 'Comment';
    body?: { markdown: string; html: string; plain: string } | null;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      type: 'User';
      name: string;
      slug: string;
      avatar: any;
      initials: string;
    };
    _links: { self: { href: string } };
  }[];
} & {
  meta: {
    current_page: number;
    next_page?: any;
    prev_page?: any;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_more_pages: boolean;
  };
};
export type ChannelListResponse = {
  data: {
    id: number;
    type: 'Channel';
    slug: string;
    title: string;
    description?: { markdown: string; html: string; plain: string } | null;
    state: 'available' | 'deleted';
    visibility: 'public' | 'private' | 'closed';
    created_at: string;
    updated_at: string;
    owner:
      | {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        }
      | {
          id: number;
          type: 'Group';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
    counts: {
      blocks: number;
      channels: number;
      contents: number;
      collaborators: number;
    };
    _links: { self: { href: string } };
    connection?: {
      id: number;
      position: number;
      pinned: boolean;
      connected_at: string;
      connected_by: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } | null;
    } | null;
    can: {
      add_to: boolean;
      update: boolean;
      destroy: boolean;
      manage_collaborators: boolean;
    };
  }[];
} & {
  meta: {
    current_page: number;
    next_page?: any;
    prev_page?: any;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_more_pages: boolean;
  };
};
export type FollowableListResponse = {
  data:
    | ({
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        created_at: string;
        updated_at: string;
        bio?: { markdown: string; html: string; plain: string } | null;
        counts: { channels: number; followers: number; following: number };
        _links: { self: { href: string } };
      })
    | {
        id: number;
        type: 'Channel';
        slug: string;
        title: string;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'deleted';
        visibility: 'public' | 'private' | 'closed';
        created_at: string;
        updated_at: string;
        owner:
          | {
              id: number;
              type: 'User';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            }
          | {
              id: number;
              type: 'Group';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            };
        counts: {
          blocks: number;
          channels: number;
          contents: number;
          collaborators: number;
        };
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
        can: {
          add_to: boolean;
          update: boolean;
          destroy: boolean;
          manage_collaborators: boolean;
        };
      }
    | ({
        id: number;
        type: 'Group';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        bio?: { markdown: string; html: string; plain: string } | null;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        counts: { channels: number; users: number };
        _links: { self: { href: string } };
      }[]);
} & {
  meta: {
    current_page: number;
    next_page?: any;
    prev_page?: any;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_more_pages: boolean;
  };
};
export type Block =
  | ({
      id: number;
      base_type: 'Block';
      title?: any;
      description?: { markdown: string; html: string; plain: string } | null;
      state: 'available' | 'pending' | 'failed' | 'processing';
      visibility: 'public' | 'private' | 'orphan';
      comment_count: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      };
      source?: {
        url: string;
        title?: any;
        provider?: { name: string; url: string } | null;
      } | null;
      _links: { self: { href: string } };
      connection?: {
        id: number;
        position: number;
        pinned: boolean;
        connected_at: string;
        connected_by: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        } | null;
      } | null;
    } & {
      type: 'Text';
      content: { markdown: string; html: string; plain: string };
    })
  | ({
      id: number;
      base_type: 'Block';
      title?: any;
      description?: { markdown: string; html: string; plain: string } | null;
      state: 'available' | 'pending' | 'failed' | 'processing';
      visibility: 'public' | 'private' | 'orphan';
      comment_count: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      };
      source?: {
        url: string;
        title?: any;
        provider?: { name: string; url: string } | null;
      } | null;
      _links: { self: { href: string } };
      connection?: {
        id: number;
        position: number;
        pinned: boolean;
        connected_at: string;
        connected_by: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        } | null;
      } | null;
    } & {
      type: 'Image';
      image: {
        alt_text?: any;
        blurhash?: any;
        width?: any;
        height?: any;
        aspect_ratio?: any;
        content_type?: string;
        filename?: string;
        file_size?: any;
        updated_at?: string;
        small: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        medium: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        large: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        square: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
      };
    })
  | ({
      id: number;
      base_type: 'Block';
      title?: any;
      description?: { markdown: string; html: string; plain: string } | null;
      state: 'available' | 'pending' | 'failed' | 'processing';
      visibility: 'public' | 'private' | 'orphan';
      comment_count: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      };
      source?: {
        url: string;
        title?: any;
        provider?: { name: string; url: string } | null;
      } | null;
      _links: { self: { href: string } };
      connection?: {
        id: number;
        position: number;
        pinned: boolean;
        connected_at: string;
        connected_by: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        } | null;
      } | null;
    } & {
      type: 'Link';
      image?: {
        alt_text?: any;
        blurhash?: any;
        width?: any;
        height?: any;
        aspect_ratio?: any;
        content_type?: string;
        filename?: string;
        file_size?: any;
        updated_at?: string;
        small: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        medium: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        large: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        square: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
      } | null;
      content?: { markdown: string; html: string; plain: string } | null;
    })
  | ({
      id: number;
      base_type: 'Block';
      title?: any;
      description?: { markdown: string; html: string; plain: string } | null;
      state: 'available' | 'pending' | 'failed' | 'processing';
      visibility: 'public' | 'private' | 'orphan';
      comment_count: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      };
      source?: {
        url: string;
        title?: any;
        provider?: { name: string; url: string } | null;
      } | null;
      _links: { self: { href: string } };
      connection?: {
        id: number;
        position: number;
        pinned: boolean;
        connected_at: string;
        connected_by: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        } | null;
      } | null;
    } & {
      type: 'Attachment';
      attachment: {
        filename?: any;
        content_type?: any;
        file_size?: any;
        file_extension?: any;
        updated_at?: any;
        url: string;
      };
      image?: {
        alt_text?: any;
        blurhash?: any;
        width?: any;
        height?: any;
        aspect_ratio?: any;
        content_type?: string;
        filename?: string;
        file_size?: any;
        updated_at?: string;
        small: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        medium: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        large: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        square: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
      } | null;
    })
  | ({
      id: number;
      base_type: 'Block';
      title?: any;
      description?: { markdown: string; html: string; plain: string } | null;
      state: 'available' | 'pending' | 'failed' | 'processing';
      visibility: 'public' | 'private' | 'orphan';
      comment_count: number;
      created_at: string;
      updated_at: string;
      user: {
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      };
      source?: {
        url: string;
        title?: any;
        provider?: { name: string; url: string } | null;
      } | null;
      _links: { self: { href: string } };
      connection?: {
        id: number;
        position: number;
        pinned: boolean;
        connected_at: string;
        connected_by: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        } | null;
      } | null;
    } & {
      type: 'Embed';
      embed: {
        url?: any;
        type?: any;
        title?: any;
        author_name?: any;
        author_url?: any;
        source_url?: any;
        width?: any;
        height?: any;
        html?: any;
        thumbnail_url?: any;
      };
      image?: {
        alt_text?: any;
        blurhash?: any;
        width?: any;
        height?: any;
        aspect_ratio?: any;
        content_type?: string;
        filename?: string;
        file_size?: any;
        updated_at?: string;
        small: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        medium: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        large: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
        square: {
          src: string;
          src_1x: string;
          src_2x: string;
          width?: any;
          height?: any;
        };
      } | null;
    });
export type ConnectableList = {
  data:
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Text';
        content: { markdown: string; html: string; plain: string };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Image';
        image: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Link';
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
        content?: { markdown: string; html: string; plain: string } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Attachment';
        attachment: {
          filename?: any;
          content_type?: any;
          file_size?: any;
          file_extension?: any;
          updated_at?: any;
          url: string;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Embed';
        embed: {
          url?: any;
          type?: any;
          title?: any;
          author_name?: any;
          author_url?: any;
          source_url?: any;
          width?: any;
          height?: any;
          html?: any;
          thumbnail_url?: any;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | {
        id: number;
        type: 'Channel';
        slug: string;
        title: string;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'deleted';
        visibility: 'public' | 'private' | 'closed';
        created_at: string;
        updated_at: string;
        owner:
          | {
              id: number;
              type: 'User';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            }
          | {
              id: number;
              type: 'Group';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            };
        counts: {
          blocks: number;
          channels: number;
          contents: number;
          collaborators: number;
        };
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
        can: {
          add_to: boolean;
          update: boolean;
          destroy: boolean;
          manage_collaborators: boolean;
        };
      }[];
};
export type EverythingList = {
  data:
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Text';
        content: { markdown: string; html: string; plain: string };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Image';
        image: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Link';
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
        content?: { markdown: string; html: string; plain: string } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Attachment';
        attachment: {
          filename?: any;
          content_type?: any;
          file_size?: any;
          file_extension?: any;
          updated_at?: any;
          url: string;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Embed';
        embed: {
          url?: any;
          type?: any;
          title?: any;
          author_name?: any;
          author_url?: any;
          source_url?: any;
          width?: any;
          height?: any;
          html?: any;
          thumbnail_url?: any;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | {
        id: number;
        type: 'Channel';
        slug: string;
        title: string;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'deleted';
        visibility: 'public' | 'private' | 'closed';
        created_at: string;
        updated_at: string;
        owner:
          | {
              id: number;
              type: 'User';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            }
          | {
              id: number;
              type: 'Group';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            };
        counts: {
          blocks: number;
          channels: number;
          contents: number;
          collaborators: number;
        };
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
        can: {
          add_to: boolean;
          update: boolean;
          destroy: boolean;
          manage_collaborators: boolean;
        };
      }
    | ({
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        created_at: string;
        updated_at: string;
        bio?: { markdown: string; html: string; plain: string } | null;
        counts: { channels: number; followers: number; following: number };
        _links: { self: { href: string } };
      })
    | ({
        id: number;
        type: 'Group';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        bio?: { markdown: string; html: string; plain: string } | null;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        counts: { channels: number; users: number };
        _links: { self: { href: string } };
      }[]);
};
export type ConnectableListResponse = {
  data:
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Text';
        content: { markdown: string; html: string; plain: string };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Image';
        image: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Link';
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
        content?: { markdown: string; html: string; plain: string } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Attachment';
        attachment: {
          filename?: any;
          content_type?: any;
          file_size?: any;
          file_extension?: any;
          updated_at?: any;
          url: string;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Embed';
        embed: {
          url?: any;
          type?: any;
          title?: any;
          author_name?: any;
          author_url?: any;
          source_url?: any;
          width?: any;
          height?: any;
          html?: any;
          thumbnail_url?: any;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | {
        id: number;
        type: 'Channel';
        slug: string;
        title: string;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'deleted';
        visibility: 'public' | 'private' | 'closed';
        created_at: string;
        updated_at: string;
        owner:
          | {
              id: number;
              type: 'User';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            }
          | {
              id: number;
              type: 'Group';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            };
        counts: {
          blocks: number;
          channels: number;
          contents: number;
          collaborators: number;
        };
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
        can: {
          add_to: boolean;
          update: boolean;
          destroy: boolean;
          manage_collaborators: boolean;
        };
      }[];
} & {
  meta:
    | {
        current_page: number;
        next_page?: any;
        prev_page?: any;
        per_page: number;
        total_pages: number;
        total_count: number;
        has_more_pages: boolean;
      }
    | {
        current_page: number;
        next_page?: any;
        prev_page?: any;
        per_page: number;
        has_more_pages: boolean;
      };
};
export type EverythingListResponse = {
  data:
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Text';
        content: { markdown: string; html: string; plain: string };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Image';
        image: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        };
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Link';
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
        content?: { markdown: string; html: string; plain: string } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Attachment';
        attachment: {
          filename?: any;
          content_type?: any;
          file_size?: any;
          file_extension?: any;
          updated_at?: any;
          url: string;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | ({
        id: number;
        base_type: 'Block';
        title?: any;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'pending' | 'failed' | 'processing';
        visibility: 'public' | 'private' | 'orphan';
        comment_count: number;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        source?: {
          url: string;
          title?: any;
          provider?: { name: string; url: string } | null;
        } | null;
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
      } & {
        type: 'Embed';
        embed: {
          url?: any;
          type?: any;
          title?: any;
          author_name?: any;
          author_url?: any;
          source_url?: any;
          width?: any;
          height?: any;
          html?: any;
          thumbnail_url?: any;
        };
        image?: {
          alt_text?: any;
          blurhash?: any;
          width?: any;
          height?: any;
          aspect_ratio?: any;
          content_type?: string;
          filename?: string;
          file_size?: any;
          updated_at?: string;
          small: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          medium: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          large: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
          square: {
            src: string;
            src_1x: string;
            src_2x: string;
            width?: any;
            height?: any;
          };
        } | null;
      })
    | {
        id: number;
        type: 'Channel';
        slug: string;
        title: string;
        description?: { markdown: string; html: string; plain: string } | null;
        state: 'available' | 'deleted';
        visibility: 'public' | 'private' | 'closed';
        created_at: string;
        updated_at: string;
        owner:
          | {
              id: number;
              type: 'User';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            }
          | {
              id: number;
              type: 'Group';
              name: string;
              slug: string;
              avatar: any;
              initials: string;
            };
        counts: {
          blocks: number;
          channels: number;
          contents: number;
          collaborators: number;
        };
        _links: { self: { href: string } };
        connection?: {
          id: number;
          position: number;
          pinned: boolean;
          connected_at: string;
          connected_by: {
            id: number;
            type: 'User';
            name: string;
            slug: string;
            avatar: any;
            initials: string;
          } | null;
        } | null;
        can: {
          add_to: boolean;
          update: boolean;
          destroy: boolean;
          manage_collaborators: boolean;
        };
      }
    | ({
        id: number;
        type: 'User';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        created_at: string;
        updated_at: string;
        bio?: { markdown: string; html: string; plain: string } | null;
        counts: { channels: number; followers: number; following: number };
        _links: { self: { href: string } };
      })
    | ({
        id: number;
        type: 'Group';
        name: string;
        slug: string;
        avatar: any;
        initials: string;
      } & {
        bio?: { markdown: string; html: string; plain: string } | null;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          type: 'User';
          name: string;
          slug: string;
          avatar: any;
          initials: string;
        };
        counts: { channels: number; users: number };
        _links: { self: { href: string } };
      }[]);
} & {
  meta: {
    current_page: number;
    next_page?: any;
    prev_page?: any;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_more_pages: boolean;
  };
};
export const ErrorSchema = v.object({
  error: v.string(),
  code: v.pipe(v.number(), v.integer()),
  details: v.optional(v.object({ message: v.optional(v.string()) })),
});
export const RateLimitErrorSchema = v.object({
  error: v.object({
    type: v.string(),
    message: v.string(),
    tier: v.picklist(['guest', 'free', 'premium', 'supporter']),
    limit: v.pipe(v.number(), v.integer()),
    limit_window: v.optional(v.string()),
    retry_after: v.pipe(v.number(), v.integer()),
    current_status: v.optional(
      v.object({
        tier: v.optional(v.string()),
        limits: v.optional(v.object({})),
        upgrade_path: v.optional(
          v.object({
            current: v.optional(v.string()),
            recommended: v.optional(v.string()),
            benefits: v.optional(v.array(v.string())),
            action: v.optional(v.string()),
          }),
        ),
      }),
    ),
    suggestions: v.array(v.string()),
    headers_note: v.optional(v.string()),
  }),
});
export const LinkSchema = v.object({ href: v.pipe(v.string(), v.url()) });
export const MarkdownContentSchema = v.object({
  markdown: v.string(),
  html: v.string(),
  plain: v.string(),
});
export const EmbeddedUserSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('User'),
  name: v.string(),
  slug: v.string(),
  avatar: v.union([v.pipe(v.string(), v.url()), v.null_()]),
  initials: v.string(),
});
export const EmbeddedGroupSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('Group'),
  name: v.string(),
  slug: v.string(),
  avatar: v.union([v.pipe(v.string(), v.url()), v.null_()]),
  initials: v.string(),
});
export const UserCountsSchema = v.object({
  channels: v.pipe(v.number(), v.integer()),
  followers: v.pipe(v.number(), v.integer()),
  following: v.pipe(v.number(), v.integer()),
});
export const GroupCountsSchema = v.object({
  channels: v.pipe(v.number(), v.integer()),
  users: v.pipe(v.number(), v.integer()),
});
export const ContentTypeFilterSchema = v.picklist([
  'Text',
  'Image',
  'Link',
  'Attachment',
  'Embed',
  'Channel',
  'Block',
]);
export const SearchTypeFilterSchema = v.picklist([
  'All',
  'Text',
  'Image',
  'Link',
  'Attachment',
  'Embed',
  'Channel',
  'Block',
  'User',
  'Group',
]);
export const FileExtensionSchema = v.picklist([
  'aac',
  'ai',
  'aiff',
  'avi',
  'avif',
  'bmp',
  'csv',
  'doc',
  'docx',
  'eps',
  'epub',
  'fla',
  'gif',
  'h264',
  'heic',
  'heif',
  'ind',
  'indd',
  'jpeg',
  'jpg',
  'key',
  'kml',
  'kmz',
  'latex',
  'm4a',
  'ma',
  'mb',
  'mid',
  'midi',
  'mov',
  'mp3',
  'mp4',
  'mp4v',
  'mpeg',
  'mpg',
  'mpg4',
  'numbers',
  'oga',
  'ogg',
  'ogv',
  'otf',
  'pages',
  'pdf',
  'pgp',
  'png',
  'ppt',
  'pptx',
  'psd',
  'svg',
  'swa',
  'swf',
  'tex',
  'texi',
  'texinfo',
  'tfm',
  'tif',
  'tiff',
  'torrent',
  'ttc',
  'ttf',
  'txt',
  'wav',
  'webm',
  'webp',
  'wma',
  'xls',
  'xlsx',
  'xlt',
]);
export const ConnectionSortSchema = v.picklist([
  'created_at_desc',
  'created_at_asc',
]);
export const ChannelContentSortSchema = v.picklist([
  'position_asc',
  'position_desc',
  'created_at_asc',
  'created_at_desc',
  'updated_at_asc',
  'updated_at_desc',
]);
export const ContentSortSchema = v.picklist([
  'created_at_asc',
  'created_at_desc',
  'updated_at_asc',
  'updated_at_desc',
]);
export const ChannelVisibilitySchema = v.picklist([
  'public',
  'private',
  'closed',
]);
export const BlockProviderSchema = v.object({
  name: v.string(),
  url: v.pipe(v.string(), v.url()),
});
export const ImageVersionSchema = v.object({
  src: v.pipe(v.string(), v.url()),
  src_1x: v.pipe(v.string(), v.url()),
  src_2x: v.pipe(v.string(), v.url()),
  width: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  height: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
});
export const BlockEmbedSchema = v.object({
  url: v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])),
  type: v.optional(v.union([v.string(), v.null_()])),
  title: v.optional(v.union([v.string(), v.null_()])),
  author_name: v.optional(v.union([v.string(), v.null_()])),
  author_url: v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])),
  source_url: v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])),
  width: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  height: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  html: v.optional(v.union([v.string(), v.null_()])),
  thumbnail_url: v.optional(v.union([v.pipe(v.string(), v.url()), v.null_()])),
});
export const BlockAttachmentSchema = v.object({
  filename: v.optional(v.union([v.string(), v.null_()])),
  content_type: v.optional(v.union([v.string(), v.null_()])),
  file_size: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  file_extension: v.optional(v.union([v.string(), v.null_()])),
  updated_at: v.optional(
    v.union([v.pipe(v.string(), v.isoTimestamp()), v.null_()]),
  ),
  url: v.pipe(v.string(), v.url()),
});
export const ChannelAbilitiesSchema = v.object({
  add_to: v.boolean(),
  update: v.boolean(),
  destroy: v.boolean(),
  manage_collaborators: v.boolean(),
});
export const ChannelCountsSchema = v.object({
  blocks: v.pipe(v.number(), v.integer()),
  channels: v.pipe(v.number(), v.integer()),
  contents: v.pipe(v.number(), v.integer()),
  collaborators: v.pipe(v.number(), v.integer()),
});
export const PaginationMetaWithCountSchema = v.object({
  current_page: v.pipe(v.number(), v.integer()),
  next_page: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  prev_page: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  per_page: v.pipe(v.number(), v.integer()),
  total_pages: v.pipe(v.number(), v.integer()),
  total_count: v.pipe(v.number(), v.integer()),
  has_more_pages: v.boolean(),
});
export const PaginationMetaWithoutCountSchema = v.object({
  current_page: v.pipe(v.number(), v.integer()),
  next_page: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  prev_page: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  per_page: v.pipe(v.number(), v.integer()),
  has_more_pages: v.boolean(),
});
export const PingResponseSchema = v.object({ status: v.literal('ok') });
export const LinksSchema = v.objectWithRest({ self: LinkSchema }, LinkSchema);
export const ConnectionContextSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  position: v.pipe(v.number(), v.integer()),
  pinned: v.boolean(),
  connected_at: v.pipe(v.string(), v.isoTimestamp()),
  connected_by: v.union([EmbeddedUserSchema, v.null_()]),
});
export const ChannelOwnerSchema = v.union([
  EmbeddedUserSchema,
  EmbeddedGroupSchema,
]);
export const BlockSourceSchema = v.object({
  url: v.pipe(v.string(), v.url()),
  title: v.optional(v.union([v.string(), v.null_()])),
  provider: v.optional(v.union([BlockProviderSchema, v.null_()])),
});
export const BlockImageSchema = v.object({
  alt_text: v.optional(v.union([v.string(), v.null_()])),
  blurhash: v.optional(v.union([v.string(), v.null_()])),
  width: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  height: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  aspect_ratio: v.optional(v.union([v.number(), v.null_()])),
  content_type: v.optional(v.string()),
  filename: v.optional(v.string()),
  file_size: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null_()])),
  updated_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  small: ImageVersionSchema,
  medium: ImageVersionSchema,
  large: ImageVersionSchema,
  square: ImageVersionSchema,
});
export const PaginatedResponseWithCountBaseSchema = v.object({
  meta: PaginationMetaWithCountSchema,
});
export const PaginationMetaSchema = v.union([
  PaginationMetaWithCountSchema,
  PaginationMetaWithoutCountSchema,
]);
export const UserSchema = EmbeddedUserSchema;
export const GroupSchema = EmbeddedGroupSchema;
export const CommentSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('Comment'),
  body: v.optional(v.union([MarkdownContentSchema, v.null_()])),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  user: EmbeddedUserSchema,
  _links: LinksSchema,
});
export const ChannelSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  type: v.literal('Channel'),
  slug: v.string(),
  title: v.string(),
  description: v.optional(v.union([MarkdownContentSchema, v.null_()])),
  state: v.picklist(['available', 'deleted']),
  visibility: ChannelVisibilitySchema,
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  owner: ChannelOwnerSchema,
  counts: ChannelCountsSchema,
  _links: LinksSchema,
  connection: v.optional(v.union([ConnectionContextSchema, v.null_()])),
  can: ChannelAbilitiesSchema,
});
export const BaseBlockPropertiesSchema = v.object({
  id: v.pipe(v.number(), v.integer()),
  base_type: v.literal('Block'),
  title: v.optional(v.union([v.string(), v.null_()])),
  description: v.optional(v.union([MarkdownContentSchema, v.null_()])),
  state: v.picklist(['available', 'pending', 'failed', 'processing']),
  visibility: v.picklist(['public', 'private', 'orphan']),
  comment_count: v.pipe(v.number(), v.integer()),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.pipe(v.string(), v.isoTimestamp()),
  user: EmbeddedUserSchema,
  source: v.optional(v.union([BlockSourceSchema, v.null_()])),
  _links: LinksSchema,
  connection: v.optional(v.union([ConnectionContextSchema, v.null_()])),
});
export const PaginatedResponseBaseSchema = v.object({
  meta: PaginationMetaSchema,
});
export const UserListSchema = v.object({ data: v.array(UserSchema) });
export const CommentListSchema = v.object({ data: v.array(CommentSchema) });
export const ChannelListSchema = v.object({ data: v.array(ChannelSchema) });
export const FollowableListSchema = v.object({
  data: v.array(v.union([UserSchema, ChannelSchema, GroupSchema])),
});
export const TextBlockSchema = BaseBlockPropertiesSchema;
export const ImageBlockSchema = BaseBlockPropertiesSchema;
export const LinkBlockSchema = BaseBlockPropertiesSchema;
export const AttachmentBlockSchema = BaseBlockPropertiesSchema;
export const EmbedBlockSchema = BaseBlockPropertiesSchema;
export const UserListResponseSchema = UserListSchema;
export const CommentListResponseSchema = CommentListSchema;
export const ChannelListResponseSchema = ChannelListSchema;
export const FollowableListResponseSchema = FollowableListSchema;
export const BlockSchema = v.union([
  TextBlockSchema,
  ImageBlockSchema,
  LinkBlockSchema,
  AttachmentBlockSchema,
  EmbedBlockSchema,
]);
export const ConnectableListSchema = v.object({
  data: v.array(
    v.union([
      TextBlockSchema,
      ImageBlockSchema,
      LinkBlockSchema,
      AttachmentBlockSchema,
      EmbedBlockSchema,
      ChannelSchema,
    ]),
  ),
});
export const EverythingListSchema = v.object({
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
    ]),
  ),
});
export const ConnectableListResponseSchema = ConnectableListSchema;
export const EverythingListResponseSchema = EverythingListSchema;
export default {
  ErrorSchema,
  RateLimitErrorSchema,
  LinkSchema,
  MarkdownContentSchema,
  EmbeddedUserSchema,
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
  BlockProviderSchema,
  ImageVersionSchema,
  BlockEmbedSchema,
  BlockAttachmentSchema,
  ChannelAbilitiesSchema,
  ChannelCountsSchema,
  PaginationMetaWithCountSchema,
  PaginationMetaWithoutCountSchema,
  PingResponseSchema,
  LinksSchema,
  ConnectionContextSchema,
  ChannelOwnerSchema,
  BlockSourceSchema,
  BlockImageSchema,
  PaginatedResponseWithCountBaseSchema,
  PaginationMetaSchema,
  UserSchema,
  GroupSchema,
  CommentSchema,
  ChannelSchema,
  BaseBlockPropertiesSchema,
  PaginatedResponseBaseSchema,
  UserListSchema,
  CommentListSchema,
  ChannelListSchema,
  FollowableListSchema,
  TextBlockSchema,
  ImageBlockSchema,
  LinkBlockSchema,
  AttachmentBlockSchema,
  EmbedBlockSchema,
  UserListResponseSchema,
  CommentListResponseSchema,
  ChannelListResponseSchema,
  FollowableListResponseSchema,
  BlockSchema,
  ConnectableListSchema,
  EverythingListSchema,
  ConnectableListResponseSchema,
  EverythingListResponseSchema,
};
