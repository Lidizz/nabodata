import { StyleSheet, View } from 'react-native';

interface MapViewProps {
  fylkeSlug?: string;
  kommuneSlug?: string;
}

// TODO: initialize @maplibre/maplibre-react-native with Kartverket tiles
// Use MapLibreGL.MapView with a style built from KARTVERKET_TILES constants
// (same logic as apps/web/lib/map.ts but as a MapLibre style spec object)
// Add ChoroplethLayer component as a child for kommune MVT tiles

export function MapView({ fylkeSlug: _fylkeSlug, kommuneSlug: _kommuneSlug }: MapViewProps) {
  return <View style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
});
