import { escapeForComment } from '../lib/sanitize';

export function generateStyleCSS(
  themeName: string,
  description: string
): string {
  const safeName = escapeForComment(themeName);
  const safeDesc = escapeForComment(description);
  const textDomain = themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/*
Theme Name: ${safeName}
Theme URI:
Author: WP Block Theme Generator
Author URI:
Description: ${safeDesc}
Version: 1.0.0
Requires at least: 6.2
Tested up to: 6.5
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${textDomain}
*/
`;
}
