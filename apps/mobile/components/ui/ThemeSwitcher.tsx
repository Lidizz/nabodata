import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMapStore } from '@nabodata/store';
import { tokens } from '@nabodata/ui';
import type { Theme } from '@nabodata/types';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Lyst' },
  { value: 'dark', label: 'Mørkt' },
  { value: 'color', label: 'Farge' },
];

export function ThemeSwitcher() {
  const { activeTheme, setTheme } = useMapStore();
  const t = tokens[activeTheme];

  return (
    <View style={[styles.container, { backgroundColor: t.surface1, borderColor: t.border1 }]}>
      {THEMES.map(({ value, label }) => (
        <TouchableOpacity
          key={value}
          onPress={() => setTheme(value)}
          style={[
            styles.button,
            activeTheme === value && { backgroundColor: t.accent },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: activeTheme === value }}
        >
          <Text
            style={[
              styles.label,
              { color: activeTheme === value ? t.fgOnAccent : t.fg2 },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
