export interface SkyuxConfigHostFrameOptionsNone {
  blackbaud?: false;
  none: true;
  self?: false;
  urls?: [];
}

export interface SkyuxConfigHostFrameOptionsOthers {
  blackbaud?: boolean;
  none?: false;
  self?: boolean;
  urls?: string[];
}
