import path from 'path';
import webpack from 'webpack';

export function applySkyAppConfigWebpackConfig(
  webpackConfig: webpack.Configuration,
  command: string,
  projectName: string
): void {
  webpackConfig.module!.rules.push({
    enforce: 'pre',
    test: /(\/|\\)__skyux(\/|\\)skyappconfig\.json$/,
    use: {
      loader: path.resolve(
        __dirname,
        './loaders/sky-app-config/sky-app-config.loader'
      ),
      options: {
        command,
        projectName
      }
    }
  });
}
