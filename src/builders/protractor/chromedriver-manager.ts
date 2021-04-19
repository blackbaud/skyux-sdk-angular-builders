import spawn from 'cross-spawn';
import path from 'path';

const matcher = require('chromedriver-version-matcher');

async function getVersion() {
  const defaultVersion = 'latest';
  const result = await matcher.getChromeDriverVersion();
  return result.chromeDriverVersion || defaultVersion;
}

export async function updateChromeDriver() {
  const version = await getVersion();
  console.log(`[skyux] Updating webdriver to version ${version}`);

  const webdriverManagerPath = path.resolve(
    'node_modules/.bin/webdriver-manager'
  );

  const result = spawn.sync(
    webdriverManagerPath,
    [
      'update',
      '--standalone=false',
      '--gecko=false',
      '--versions.chrome',
      version
    ],
    {
      stdio: 'inherit'
    }
  );

  if (result.error) {
    console.error('[skyux] Failed to update webdriver.');
    throw result.error;
  }

  console.log('[skyux] Webdriver successfully updated.');
}
