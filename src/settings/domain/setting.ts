export interface SettingsShape {
  multi_region_enabled: boolean;
  vendors_auto_approve: boolean;
  products_auto_approve: boolean;
  default_region_code: string;
  default_locale_code: string;
}

export const DEFAULT_SETTINGS: SettingsShape = {
  multi_region_enabled: false,
  vendors_auto_approve: false,
  products_auto_approve: false,
  default_region_code: 'SA',
  default_locale_code: 'ar',
};

// Subset safe to expose on the public endpoint
export type PublicSettingsShape = Pick<
  SettingsShape,
  'multi_region_enabled' | 'default_region_code' | 'default_locale_code'
>;
