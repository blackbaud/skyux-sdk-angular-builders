import spawn from 'cross-spawn';

interface InstallPackagesConfig {
  location?: 'devDependencies' | 'dependencies';
}

export function installPackages(
  packages: string[],
  config?: InstallPackagesConfig
): void {
  console.log(`Installing ${packages.join(' ')}...`);

  const args = ['install', ...packages, '--silent', '--quiet'];
  if (config?.location === 'devDependencies') {
    args.push('--save-dev');
  }

  spawn.sync('npm', args, {
    stdio: 'pipe' // Suppress output from NPM.
  });

  console.log(`Installed ${packages.join(' ')} successfully.`);
}
