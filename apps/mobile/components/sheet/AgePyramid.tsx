import { View, Text, StyleSheet } from 'react-native';
import type { AgeDistribution } from '@nabodata/types';
import { useMapStore } from '@nabodata/store';
import { tokens } from '@nabodata/ui';

interface AgePyramidProps {
  data: AgeDistribution;
}

export function AgePyramid({ data }: AgePyramidProps) {
  const { activeTheme } = useMapStore();
  const t = tokens[activeTheme];

  const maxCount = Math.max(...data.bands.flatMap((b) => [b.male, b.female]));

  return (
    <View>
      <Text style={[styles.title, { color: t.fg2 }]}>ALDERSFORDELING</Text>
      {data.bands.map((band) => {
        const maleW = maxCount > 0 ? (band.male / maxCount) * 100 : 0;
        const femaleW = maxCount > 0 ? (band.female / maxCount) * 100 : 0;
        return (
          <View key={band.label} style={styles.row}>
            <View style={[styles.barWrap, styles.leftWrap]}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${maleW}%`,
                    backgroundColor: t.viz4,
                    alignSelf: 'flex-end',
                  },
                ]}
              />
            </View>
            <Text style={[styles.bandLabel, { color: t.fg3 }]}>{band.label}</Text>
            <View style={styles.barWrap}>
              <View style={[styles.bar, { width: `${femaleW}%`, backgroundColor: t.viz1 }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  barWrap: {
    flex: 1,
    height: 14,
    overflow: 'hidden',
  },
  leftWrap: {
    alignItems: 'flex-end',
  },
  bar: {
    height: 14,
    borderRadius: 2,
  },
  bandLabel: {
    fontSize: 9,
    fontFamily: 'IBMPlexMono',
    width: 28,
    textAlign: 'center',
  },
});
