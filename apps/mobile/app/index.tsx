import { StyleSheet, View } from 'react-native';
import { MapView } from '../components/map/MapView';
import { BottomSheet } from '../components/sheet/BottomSheet';
import { SearchBar } from '../components/ui/SearchBar';
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher';
import { useMapStore } from '@nabodata/store';
import { tokens } from '@nabodata/ui';

export default function HomeScreen() {
  const { activeTheme } = useMapStore();
  const t = tokens[activeTheme];

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MapView />
      <View style={styles.overlay} pointerEvents="box-none">
        <SearchBar />
        <ThemeSwitcher />
      </View>
      <BottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 56,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
});
