import { escapeForComment, escapeForPHPString } from '../lib/sanitize';

export function generateFunctionsPHP(themeName: string): string {
  const safeName = escapeForComment(themeName);
  const textDomain = themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const funcPrefix = textDomain.replace(/-/g, '_');
  const safeTextDomain = escapeForPHPString(textDomain);
  return `<?php
/**
 * ${safeName} functions and definitions.
 *
 * @package ${safeTextDomain}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue editor styles.
 */
function ${funcPrefix}_editor_styles() {
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', '${funcPrefix}_editor_styles' );

/**
 * Register pattern categories.
 */
function ${funcPrefix}_register_pattern_categories() {
	register_block_pattern_category( 'featured', array(
		'label' => __( 'Featured', '${safeTextDomain}' ),
	) );
}
add_action( 'init', '${funcPrefix}_register_pattern_categories' );
`;
}
