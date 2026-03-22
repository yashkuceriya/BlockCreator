import JSZip from 'jszip';
import { ThemeFiles } from '../types';

function buildZip(themeSlug: string, files: ThemeFiles): JSZip {
  const zip = new JSZip();
  const root = zip.folder(themeSlug)!;

  root.file('style.css', files['style.css']);
  root.file('theme.json', files['theme.json']);
  root.file('functions.php', files['functions.php']);
  root.file('readme.txt', files['readme.txt']);

  const templatesDir = root.folder('templates')!;
  for (const [name, content] of Object.entries(files.templates)) {
    templatesDir.file(name, content);
  }

  const partsDir = root.folder('parts')!;
  for (const [name, content] of Object.entries(files.parts)) {
    partsDir.file(name, content);
  }

  const patternsDir = root.folder('patterns')!;
  for (const [name, content] of Object.entries(files.patterns)) {
    patternsDir.file(name, content);
  }

  return zip;
}

export async function packageTheme(
  themeSlug: string,
  files: ThemeFiles
): Promise<Blob> {
  return buildZip(themeSlug, files).generateAsync({ type: 'blob' });
}

export async function packageThemeAsBuffer(
  themeSlug: string,
  files: ThemeFiles
): Promise<Buffer> {
  return buildZip(themeSlug, files).generateAsync({ type: 'nodebuffer' });
}
