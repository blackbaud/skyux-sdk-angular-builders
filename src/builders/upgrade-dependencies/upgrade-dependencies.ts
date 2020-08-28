import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  JsonObject
} from '@angular-devkit/core';

import * as fs from 'fs-extra';
import latestVersion from 'latest-version';
import path from 'path';
import semver from 'semver';

import {
  DEPENDENCIES_MAP
} from './dependencies-map';

interface SkyuxUpgradeDependenciesOptions {
  dryRun: boolean;
}

interface PackageDependencies {
  [_: string]: string;
}

interface PackageJson {
  dependencies?: {
    [_: string]: string;
  };
  devDependencies?: {
    [_: string]: string;
  };
}

function filterUpdatableDependencies(dependencies: PackageDependencies): PackageDependencies {
  const filtered: PackageDependencies = {};

  for (let i = 0, len = DEPENDENCIES_MAP.length; i < len; i++) {
    const check = DEPENDENCIES_MAP[i];

    Object.keys(dependencies).forEach((packageName) => {
      if (check.test.test(packageName)) {
        const currentVersion = check.version;
        const validRange = semver.validRange(currentVersion);

        let newVersionRange: string;
        if (validRange === currentVersion) {
          // Convert the specific version into a range.
          newVersionRange = `^${currentVersion}`;
        } else if (currentVersion === 'latest') {
          // Use 'latest' dist-tag.
          newVersionRange = 'latest';
        } else {
          // Use the validated range.
          newVersionRange = validRange;
        }

        filtered[packageName] = newVersionRange;
      }
    });
  }

  return filtered;
}

async function getUpdatedDependencyVersions(
  dependenciesToCheck: PackageDependencies,
  originalDependencies: PackageDependencies
): Promise<{
  ignore: PackageDependencies;
  notFound: PackageDependencies;
  update: PackageDependencies;
}> {
  const dependenciesToUpdate: PackageDependencies = {};
  const dependenciesToIgnore: PackageDependencies = {};
  const dependenciesNotFound: PackageDependencies = {};

  for (const packageName in dependenciesToCheck) {
    const versionRange = dependenciesToCheck[packageName];
    let version: string;
    try {
      version = await latestVersion(packageName, { version: `${versionRange}`});
      if (originalDependencies[packageName] !== version) {
        dependenciesToUpdate[packageName] = version;
      } else {
        dependenciesToIgnore[packageName] = version;
      }
    } catch (err) {
      dependenciesNotFound[packageName] = versionRange;
    }
  }

  return {
    ignore: dependenciesToIgnore,
    notFound: dependenciesNotFound,
    update: dependenciesToUpdate
  };
}

function printResults(dependencies: PackageDependencies): void {
  console.table(Object.keys(dependencies).map((packageName) => {
    return {
      Name: packageName,
      Version: dependencies[packageName]
    };
  }).sort(function alphabeticalSort(a, b) {
    if (a.Name < b.Name) {
      return -1;
    }
    if (a.Name > b.Name) {
      return 1;
    }
    return 0;
  }));
}

async function applyPackageJsonChanges(
  updates: PackageDependencies,
  packageJson: PackageJson,
  packageJsonFilePath: string
): Promise<void> {

  for (const packageName in updates) {
    if (packageJson.dependencies && packageJson.dependencies[packageName]) {
      packageJson.dependencies[packageName] = updates[packageName];
    } else if (packageJson.devDependencies && packageJson.devDependencies[packageName]) {
      packageJson.devDependencies[packageName] = updates[packageName];
    }
  }

  await fs.writeJson(packageJsonFilePath, packageJson, {
    spaces: 2
  });
}

async function skyuxUpgradeDependencies(
  options: SkyuxUpgradeDependenciesOptions,
  context: BuilderContext
): Promise<BuilderOutput> {

  context.logger.info(
    `Upgrading package dependencies with options:\n${JSON.stringify(options, undefined, 2)}\n`
  );

  const packageJsonFilePath = path.join(process.cwd(), 'package.json');
  const packageJson = await fs.readJson(packageJsonFilePath);

  const dependencies = {
    ...packageJson.devDependencies,
    ...packageJson.dependencies
  };

  const dependenciesToCheck = filterUpdatableDependencies(dependencies);
  const updatedDependencies = await getUpdatedDependencyVersions(dependenciesToCheck, dependencies);

  for (const packageName in updatedDependencies.ignore) {
    context.logger.warn(
      `Ignoring ${packageName}@${updatedDependencies.ignore[packageName]} since it is already set to the latest supported version.`
    );
  }

  const dependenciesToUpdate = updatedDependencies.update;

  if (Object.keys(dependenciesToUpdate).length) {
    if (options.dryRun) {
      context.logger.warn(
        'The following dependencies have updated versions available. (Remove --dry-run to update them automatically.)'
      );
      printResults(dependenciesToUpdate);
    } else {
      context.logger.info(
        'The following dependencies have been updated:'
      );
      printResults(dependenciesToUpdate);
      await applyPackageJsonChanges(dependenciesToUpdate, packageJson, packageJsonFilePath);
      context.logger.warn(
        'Dependencies successfully updated. Run `npm install` to install them.'
      );
    }
  } else {
    context.logger.info('All dependencies are up to date.');
  }

  for (const packageName in updatedDependencies.notFound) {
    context.logger.error(
      `Version not found! ${packageName}@${updatedDependencies.notFound[packageName]}`
    );
  }

  context.logger.info('Done.');

  return Promise.resolve({
    success: true
  });
}

export default createBuilder<JsonObject & SkyuxUpgradeDependenciesOptions>(skyuxUpgradeDependencies);
