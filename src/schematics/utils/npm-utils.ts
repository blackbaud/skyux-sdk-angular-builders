import spawn from 'cross-spawn';

interface InstallPackagesConfig {
  location?: 'devDependencies' | 'dependencies';
}

export function installPackages(
  packages: string[],
  config?: InstallPackagesConfig
): void {
  const args = ['install', ...packages];
  if (config?.location === 'devDependencies') {
    args.push('--save-dev');
  }

  spawn.sync('npm', args, {
    stdio: 'pipe' // Suppress output from NPM.
  });
}
