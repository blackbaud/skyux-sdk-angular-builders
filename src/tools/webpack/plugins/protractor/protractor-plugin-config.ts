export interface SkyuxProtractorPluginConfig {
  hostUrlFactory: () => Promise<string>;
}
