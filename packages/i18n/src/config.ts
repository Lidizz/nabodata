import type { InitOptions } from 'i18next';

export const defaultNS = 'common';
export const namespaces = ['common', 'map', 'data', 'meta'] as const;
export type Namespace = (typeof namespaces)[number];

export const i18nConfig: InitOptions = {
  defaultNS,
  ns: namespaces,
  fallbackLng: 'nb',
  supportedLngs: ['nb', 'en'],
  interpolation: {
    escapeValue: false,
  },
  load: 'languageOnly',
};
