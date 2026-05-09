import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#ffffff";
const INACTIVE = "#827a87";

const BAR_RADIUS = 28;
const BAR_HEIGHT = 68;
const INNER_PADDING = 6;
const INDICATOR_INSET = 5;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const routeCount = Math.max(state.routes.length, 1);

  const itemWidth = useMemo(() => {
    if (containerWidth <= 0) return 0;
    return (containerWidth - INNER_PADDING * 2) / routeCount;
  }, [containerWidth, routeCount]);

  const indicatorWidth = Math.max(0, itemWidth - INDICATOR_INSET * 2);

  useEffect(() => {
    if (itemWidth <= 0) return;
    const nextX =
      INNER_PADDING +
      state.index * itemWidth +
      (itemWidth - indicatorWidth) / 2;

    indicatorX.value = withTiming(nextX, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });
  }, [itemWidth, indicatorWidth, state.index, indicatorX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View
        style={styles.container}
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      >
        <BlurView intensity={42} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.02)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          {indicatorWidth > 0 ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.indicator,
                { width: indicatorWidth },
                animatedIndicatorStyle,
              ]}
            >
              <LinearGradient
                colors={["rgba(167, 83, 255, 0.38)", "rgba(255,255,255,0.14)"]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          ) : null}

          <View style={styles.row}>
            {state.routes.map((route, index) => {
              const options = descriptors[route.key]?.options;
              const isFocused = state.index === index;
              const tint = isFocused ? ACTIVE : INACTIVE;

              const title =
                typeof options?.title === "string" ? options.title : route.name;

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options?.tabBarAccessibilityLabel}
                  onLongPress={() =>
                    navigation.emit({
                      type: "tabLongPress",
                      target: route.key,
                    })
                  }
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    const event = navigation.emit({
                      type: "tabPress",
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name, route.params);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.tab,
                    { width: itemWidth || undefined },
                    {
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  {options?.tabBarIcon?.({
                    focused: isFocused,
                    color: tint,
                    size: isFocused ? 26 : 23,
                  })}
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.label,
                      {
                        color: tint,
                        fontFamily: isFocused
                          ? "Poppins_600SemiBold"
                          : "Poppins_500Medium",
                      },
                    ]}
                  >
                    {title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
  },
  container: {
    borderRadius: BAR_RADIUS,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
    ...Platform.select({
      ios: {
        shadowColor: "#8f42ff",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
      },
      android: {
        elevation: 14,
      },
      default: {},
    }),
  },
  blur: {
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    justifyContent: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: INNER_PADDING,
    paddingVertical: 6,
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 6,
    bottom: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    overflow: "hidden",
    zIndex: 1,
  },
  tab: {
    flexGrow: 1,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  label: {
    marginTop: 2,
    fontSize: 11.5,
    letterSpacing: 0.2,
    lineHeight: 14,
    textAlign: "center",
  },
});
