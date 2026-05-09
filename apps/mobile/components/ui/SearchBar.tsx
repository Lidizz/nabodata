import { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { search } from '@nabodata/api-client';
import type { KommuneSummary } from '@nabodata/types';
import { useMapStore } from '@nabodata/store';
import { tokens } from '@nabodata/ui';

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3002';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KommuneSummary[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { activeTheme } = useMapStore();
  const t = tokens[activeTheme];

  function handleChange(text: string) {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      void search(API_URL, text.trim(), 'nb').then(({ data }) => setResults(data.results));
    }, 200);
  }

  function handleSelect(k: KommuneSummary) {
    setQuery('');
    setResults([]);
    router.push(`/(nb)/kommune/${k.slug}`);
  }

  return (
    <View style={styles.wrap}>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder="Søk etter kommune…"
        placeholderTextColor={t.fg4}
        style={[
          styles.input,
          { backgroundColor: t.surface1, borderColor: t.border1, color: t.fg1 },
        ]}
        accessibilityLabel="Søk etter kommune eller fylke"
        returnKeyType="search"
      />
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(k) => k.id}
          style={[styles.list, { backgroundColor: t.surface1, borderColor: t.border1 }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={[styles.item, { borderBottomColor: t.border1 }]}
            >
              <Text style={[styles.itemText, { color: t.fg1 }]}>{item.name.nb}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  list: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 220,
    zIndex: 20,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 14 },
});
