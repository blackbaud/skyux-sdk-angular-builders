import { SkyuxConfig } from '../../shared/skyux-config';
import { SkyuxKarmaBuilderOptions } from './karma-options';

export abstract class SkyuxKarmaConfigAdapter {
  /**
   * Options applied to the Angular CLI builder.
   */
  public static builderOptions: SkyuxKarmaBuilderOptions;

  /**
   * The contents of the project's skyuxconfig.json file.
   */
  public static skyuxConfig: SkyuxConfig;
}
