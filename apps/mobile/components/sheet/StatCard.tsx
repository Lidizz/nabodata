import { View, Text, StyleSheet } from 'react-native';
import { useMapStore } from '@nabodata/store';
import { tokens } from '@nabodata/ui';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
}

export function StatCard({ label, value, unit, trend, trendLabel }: StatCardProps) {
  const { activeTheme } = useMapStore();
  const t = tokens[activeTheme];

  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <View style={[styles.card, { backgroundColor: t.surface2, borderColor: t.border1 }]}>
      <Text style={[styles.label, { color: t.fg2 }]}>{label.toUpperCase()}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: t.fg1 }]}>
          {value.toLocaleString('nb-NO')}
        </Text>
        {unit && <Text style={[styles.unit, { color: t.fg3 }]}>{unit}</Text>}
      </View>
      {trend !== undefined && trendLabel && (
        <Text
          style={[
            styles.trend,
            {
              color: isPositive ? t.success : isNegative ? t.danger : t.fg3,
              fontFamily: tokens.shared.fontMono,
            },
          ]}
        >
          {isPositive ? '▲' : isNegative ? '▼' : '–'}{' '}
          {Math.abs(trend).toLocaleString('nb-NO', { minimumFractionDigits: 1 })} %{' '}
          {trendLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: '600',
  },
  unit: {
    fontSize: 15,
    fontWeight: '400',
  },
  trend: {
    fontSize: 11,
    marginTop: 4,
  },
});
