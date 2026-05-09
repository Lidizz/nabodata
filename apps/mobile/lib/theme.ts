import type { Theme } from '@nabodata/types';
import { tokens } from '@nabodata/ui';

export function getTokensForTheme(theme: Theme) {
  return tokens[theme];
}
