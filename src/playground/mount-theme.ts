import { ThemeFiles } from '../types';

export interface PlaygroundClient {
  writeFile(path: string, content: string): Promise<void>;
  run(options: { code: string }): Promise<unknown>;
  mkdir(path: string): Promise<void>;
}

export async function mountTheme(
  client: PlaygroundClient,
  themeSlug: string,
  themeFiles: ThemeFiles
): Promise<void> {
  const safeName = themeSlug.replace(/[^a-z0-9-]/g, '');
  const basePath = `/wordpress/wp-content/themes/${safeName}`;

  // Create directory structure first
  try {
    await client.mkdir(basePath);
  } catch {
    // mkdir might not exist on all Playground versions — fall back to PHP
    await client.run({
      code: `<?php
        @mkdir('${basePath}', 0777, true);
        @mkdir('${basePath}/templates', 0777, true);
        @mkdir('${basePath}/parts', 0777, true);
        @mkdir('${basePath}/patterns', 0777, true);
      ?>`,
    });
  }

  // Ensure subdirectories exist
  for (const dir of ['templates', 'parts', 'patterns']) {
    try {
      await client.mkdir(`${basePath}/${dir}`);
    } catch {
      // Already created via PHP fallback above
    }
  }

  const writeFile = async (path: string, content: string) => {
    try {
      await client.writeFile(path, content);
    } catch (err) {
      throw new Error(
        `Failed to write ${path.replace(basePath, '')}: ${err instanceof Error ? err.message : 'unknown error'}`
      );
    }
  };

  await writeFile(`${basePath}/style.css`, themeFiles['style.css']);
  await writeFile(`${basePath}/theme.json`, themeFiles['theme.json']);
  await writeFile(`${basePath}/functions.php`, themeFiles['functions.php']);
  await writeFile(`${basePath}/readme.txt`, themeFiles['readme.txt']);

  for (const [name, content] of Object.entries(themeFiles.templates)) {
    await writeFile(`${basePath}/templates/${name}`, content);
  }

  for (const [name, content] of Object.entries(themeFiles.parts)) {
    await writeFile(`${basePath}/parts/${name}`, content);
  }

  for (const [name, content] of Object.entries(themeFiles.patterns)) {
    await writeFile(`${basePath}/patterns/${name}`, content);
  }

  // Activate theme and set a static front page using the "home" template
  await client.run({
    code: `<?php
      require_once '/wordpress/wp-load.php';
      switch_theme('${safeName}');

      // Create a front page that uses the "home" template
      $front_page_id = wp_insert_post(array(
        'post_title'   => 'Home',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => '',
        'page_template' => '',
      ));

      if ($front_page_id && !is_wp_error($front_page_id)) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $front_page_id);
        // Set the template to "home" via post meta
        update_post_meta($front_page_id, '_wp_page_template', 'home');
      }

      echo 'Theme activated: ${safeName}';
    ?>`,
  });
}
