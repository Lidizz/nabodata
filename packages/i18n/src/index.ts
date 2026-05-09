import i18next from 'i18next';
import { i18nConfig } from './config.js';

import nbCommon from './locales/nb/common.json' with  { type: 'json' };
import nbMap from './locales/nb/map.json' with  { type: 'json' };
import nbData from './locales/nb/data.json' with  { type: 'json' };
import nbMeta from './locales/nb/meta.json' with  { type: 'json' };
import enCommon from './locales/en/common.json' with  { type: 'json' };
import enMap from './locales/en/map.json' with  { type: 'json' };
import enData from './locales/en/data.json' with  { type: 'json' };
import enMeta from './locales/en/meta.json' with  { type: 'json' };

const resources = {
  nb: { common: nbCommon, map: nbMap, data: nbData, meta: nbMeta },
  en: { common: enCommon, map: enMap, data: enData, meta: enMeta },
};

void i18next.init({ ...i18nConfig, resources });

export { i18next as i18n };
export { i18nConfig, namespaces, defaultNS } from './config.js';
export type { Namespace } from './config.js';
