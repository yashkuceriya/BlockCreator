export const ALLOWED_BLOCKS: ReadonlySet<string> = new Set([
  // Text
  'core/paragraph',
  'core/heading',
  'core/list',
  'core/list-item',
  'core/quote',
  'core/pullquote',
  'core/preformatted',
  'core/verse',
  'core/code',
  'core/details',
  'core/freeform',
  'core/missing',

  // Media
  'core/image',
  'core/gallery',
  'core/audio',
  'core/video',
  'core/cover',
  'core/file',
  'core/media-text',

  // Design / Layout
  'core/buttons',
  'core/button',
  'core/columns',
  'core/column',
  'core/group',
  'core/row',
  'core/stack',
  'core/separator',
  'core/spacer',
  'core/more',
  'core/nextpage',

  // Widgets
  'core/archives',
  'core/calendar',
  'core/categories',
  'core/latest-comments',
  'core/latest-posts',
  'core/page-list',
  'core/page-list-item',
  'core/rss',
  'core/search',
  'core/shortcode',
  'core/social-links',
  'core/social-link',
  'core/tag-cloud',

  // Theme / Site
  'core/navigation',
  'core/navigation-link',
  'core/navigation-submenu',
  'core/site-logo',
  'core/site-title',
  'core/site-tagline',
  'core/query',
  'core/query-pagination',
  'core/query-pagination-next',
  'core/query-pagination-numbers',
  'core/query-pagination-previous',
  'core/query-no-results',
  'core/query-title',
  'core/post-template',
  'core/post-title',
  'core/post-content',
  'core/post-date',
  'core/post-excerpt',
  'core/post-featured-image',
  'core/post-terms',
  'core/post-author',
  'core/post-author-name',
  'core/post-author-biography',
  'core/post-comments-form',
  'core/post-navigation-link',
  'core/comments',
  'core/comment-author-name',
  'core/comment-content',
  'core/comment-date',
  'core/comment-edit-link',
  'core/comment-reply-link',
  'core/comment-template',
  'core/comments-title',
  'core/comments-pagination',
  'core/comments-pagination-next',
  'core/comments-pagination-numbers',
  'core/comments-pagination-previous',
  'core/home-link',
  'core/loginout',
  'core/term-description',
  'core/avatar',
  'core/read-more',
  'core/post-time-to-read',
  'core/template-part',
  'core/pattern',

  // Embeds
  'core/embed',

  // Table
  'core/table',

  // Footnotes
  'core/footnotes',
]);

export const HARD_REJECTED_BLOCKS: ReadonlySet<string> = new Set([
  'core/html',
]);

export const REQUIRED_TEMPLATES = ['index', 'home', 'single', 'page', 'archive', '404'] as const;

export const REQUIRED_PARTS = ['header', 'footer'] as const;

export const MAX_RETRIES = 2;

export const THEME_JSON_VERSION = 2;
