import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BAR_H = 52;
const BAR_RADIUS = 14;
const BAR_MARGIN_X = 20;
const ICON_SIZE = 22;
const SLOT_PAD_V = 6;
const SLOT_RADIUS = 10;

/** Calm, precise — no bouncy “toy” motion */
const SLOT_SPRING = { damping: 28, stiffness: 420, mass: 0.85 };

const SURFACE = "#0e0c10";
const SURFACE_BORDER = "rgba(255,255,255,0.06)";
const SLOT_FILL = "rgba(255,255,255,0.055)";
const SLOT_STROKE = "rgba(255,255,255,0.05)";
const ICON_ACTIVE = "#f2f0f4";
const ICON_IDLE = "#5a545e";

type TabMetrics = { x: number; width: number };

type TabItemProps = {
  route: BottomTabBarProps["state"]["routes"][number];
  descriptor: BottomTabBarProps["descriptors"][string];
  focused: boolean;
  onPress: () => void;
  onCellLayout: (e: LayoutChangeEvent) => void;
};

function TabItem({
  route,
  descriptor,
  focused,
  onPress,
  onCellLayout,
}: TabItemProps) {
  const { options } = descriptor;
  const label = options.title ?? route.name;

  const t = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    t.value = withTiming(focused ? 1 : 0, { duration: 160 });
  }, [focused, t]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.55, 1]),
  }));

  const color = focused ? ICON_ACTIVE : ICON_IDLE;

  return (
    <Pressable
      onPress={onPress}
      onLayout={onCellLayout}
      style={styles.tabCell}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      android_ripple={{ color: "rgba(255,255,255,0.06)", borderless: true }}
    >
      <Animated.View style={iconStyle}>
        {options.tabBarIcon?.({
          focused,
          color,
          size: ICON_SIZE,
        })}
      </Animated.View>
    </Pressable>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 10) + 6;
  const routeCount = state.routes.length;

  const metricsRef = useRef<TabMetrics[]>(
    Array.from({ length: routeCount }, () => ({ x: 0, width: 0 })),
  );
  useLayoutEffect(() => {
    if (metricsRef.current.length !== routeCount) {
      metricsRef.current = Array.from({ length: routeCount }, () => ({
        x: 0,
        width: 0,
      }));
    }
  }, [routeCount]);

  const [, bumpLayout] = useState(0);
  const slotLeft = useSharedValue(0);
  const slotWidth = useSharedValue(0);
  const slotVisible = useSharedValue(0);

  const metricsReady =
    metricsRef.current.length === routeCount &&
    metricsRef.current.every((m) => m.width > 0);

  useLayoutEffect(() => {
    if (!metricsReady) return;
    const m = metricsRef.current[state.index];
    if (m.width <= 0) return;
    slotLeft.value = withSpring(m.x, SLOT_SPRING);
    slotWidth.value = withSpring(m.width, SLOT_SPRING);
    slotVisible.value = withTiming(1, { duration: 120 });
  }, [state.index, metricsReady, slotLeft, slotWidth, slotVisible]);

  const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    metricsRef.current[index] = { x, width };
    bumpLayout((n) => n + 1);
    if (index === state.index && width > 0) {
      slotLeft.value = withSpring(x, SLOT_SPRING);
      slotWidth.value = withSpring(width, SLOT_SPRING);
      slotVisible.value = 1;
    }
  };

  const slotStyle = useAnimatedStyle(() => ({
    opacity: slotVisible.value,
    left: slotLeft.value,
    width: slotWidth.value,
  }));

  const go = (
    route: BottomTabBarProps["state"]["routes"][number],
    index: number,
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.index !== index) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View
      style={[styles.anchor, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <View style={styles.barShadow}>
        <View style={styles.bar}>
          <Animated.View style={[styles.selectionSlot, slotStyle]} />

          <View style={styles.row}>
            {state.routes.map((route, index) => (
              <TabItem
                key={route.key}
                route={route}
                descriptor={descriptors[route.key]}
                focused={state.index === index}
                onPress={() => go(route, index)}
                onCellLayout={onTabLayout(index)}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    left: BAR_MARGIN_X,
    right: BAR_MARGIN_X,
  },
  barShadow: {
    borderRadius: BAR_RADIUS,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },
  bar: {
    height: BAR_H,
    borderRadius: BAR_RADIUS,
    backgroundColor: SURFACE,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SURFACE_BORDER,
  },
  selectionSlot: {
    position: "absolute",
    top: SLOT_PAD_V,
    height: BAR_H - SLOT_PAD_V * 2,
    borderRadius: SLOT_RADIUS,
    backgroundColor: SLOT_FILL,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SLOT_STROKE,
  },
  barStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BAR_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.03)",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    zIndex: 1,
  },
  tabCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: BAR_H,
  },
});
