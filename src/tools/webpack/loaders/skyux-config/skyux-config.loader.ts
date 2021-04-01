import {
  getSkyuxConfig
} from '../../../../shared/skyux-config-utils';

export default function skyuxConfigLoader() {
  const skyuxConfig = getSkyuxConfig();
  return JSON.stringify(skyuxConfig);
}
