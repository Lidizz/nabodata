import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMapStore } from '@nabodata/store';
import { tokens } from '@nabodata/ui';

const { height: SCREEN_H } = Dimensions.get('window');

const SNAP_COLLAPSED = SCREEN_H - 88;
const SNAP_HALF = SCREEN_H * 0.5;
const SNAP_EXPANDED = 56;

function nearestSnap(y: number): number {
  const snaps = [SNAP_COLLAPSED, SNAP_HALF, SNAP_EXPANDED];
  return snaps.reduce((prev, curr) =>
    Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev,
  );
}

export function BottomSheet() {
  const translateY = useSharedValue(SNAP_COLLAPSED);
  const context = useSharedValue(SNAP_COLLAPSED);
  const { activeTheme } = useMapStore();
  const t = tokens[activeTheme];

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(
        SNAP_EXPANDED,
        Math.min(SNAP_COLLAPSED, context.value + e.translationY),
      );
    })
    .onEnd((e) => {
      const projected = translateY.value + e.velocityY * 0.1;
      const snap = nearestSnap(projected);
      translateY.value = withSpring(snap, {
        damping: 24,
        stiffness: 200,
        mass: 0.8,
      });
      runOnJS(() => {})();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.sheet,
          animatedStyle,
          {
            backgroundColor: t.surface1,
            borderTopColor: t.border1,
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: t.borderStrong }]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_H,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 999,
  },
});
