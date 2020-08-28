function enforceTrailingSlash(url: string): string {
  return (url.endsWith('/')) ? url: `${url}/`;
}

// Applies the default values to the "skyux options"
export function applyDefaultOptions(options: any) {
  const defaults: { [key: string]: any } = {
    skyuxAssetsBaseUrl: '',
    skyuxHostUrl: 'https://app.blackbaud.com/',
    skyuxLocalUrl: `https://${options.host}:${options.port}/`
  };

  // NG schema validator includes all properties so spread operator merge will not work
  // This catches prop: undefined that {...} will not
  Object.keys(defaults).forEach(key => {
    if (!options[key]) {
      options[key] = defaults[key];
    }
  });

  // Must contain trailing slash
  options.skyuxHostUrl = enforceTrailingSlash(options.skyuxHostUrl);
  options.skyuxLocalUrl = enforceTrailingSlash(options.skyuxLocalUrl);
}