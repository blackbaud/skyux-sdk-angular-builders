import glob from 'glob';
import path from 'path';

export function getSpecFiles(): string[] {
  return glob.sync(path.join(process.cwd(), '?(src|projects)/**/*.spec.ts'), {
    nodir: true
  });
}
