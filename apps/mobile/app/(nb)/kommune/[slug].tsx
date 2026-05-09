import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { MapView } from '../../../components/map/MapView';
import { BottomSheet } from '../../../components/sheet/BottomSheet';

export default function KommuneScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View style={styles.container}>
      <MapView kommuneSlug={slug} />
      <BottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
