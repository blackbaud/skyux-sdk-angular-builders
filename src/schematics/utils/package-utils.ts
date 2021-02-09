import {
  workspaces
} from '@angular-devkit/core';

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: {[_: string]: string}) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      (result as {[_: string]: string})[key] = obj[key];
      return result;
    }, {});
}

/**
 * Adds a package to the package.json in the given host tree.
 */
export async function addPackageToPackageJson(
  host: workspaces.WorkspaceHost,
  packageName: string,
  version: string,
  location = 'dependencies'
): Promise<void> {
  const sourceText = await host.readFile('package.json');
  const json = JSON.parse(sourceText);

  json[location] = json[location] || {};
  json[location][packageName] = version;
  json[location] = sortObjectByKeys(json[location]);

  await host.writeFile('package.json', JSON.stringify(json, undefined, 2));
}
