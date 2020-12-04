import { DevServerBuilderOptions } from '@angular-devkit/build-angular';
// import {
//   getCertPath
// } from '../../shared/cert-utils';

// import {
//   getHostUrlFromOptions
// } from '../../shared/host-utils';

// import {
//   SkyuxDevServerBuilderOptions
// } from './dev-server-options';

export function getLocalUrlFromOptions(options: DevServerBuilderOptions): string {
  return `https://${options.host}:${options.port}/`;
}

// export function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): void {

//   if (options.skyuxLaunch === undefined) {
//     return;
//   }

//   // Enforce HTTPS.
//   options.ssl = true;
//   options.sslCert = getCertPath('skyux-server.crt');
//   options.sslKey = getCertPath('skyux-server.key');

//   // Set options specific to SKY UX Host.
//   if (options.skyuxLaunch === 'host') {
//     const hostUrl = getHostUrlFromOptions(options);
//     const localUrl = getLocalUrlFromOptions(options);

//     options.skyuxHostUrl = hostUrl;

//     // Point live-reloading back to localhost.
//     options.publicHost = localUrl;
//     options.allowedHosts = ['.blackbaud.com'];

//     // Point lazy-loaded modules to the localhost URL.
//     options.deployUrl = localUrl;
//     options.servePath = '/';
//   }

//   // Open the user's default browser automatically.
//   if (options.skyuxLaunch === 'local') {
//     options.open = true;
//   }
// }
