import { useMemo } from "react";
import { Image, useWindowDimensions, View } from "react-native";

const ROOT_BG_SOURCE = require("@/assets/images/rootBg.png");

function makeStars(count: number, width: number, height: number) {
    return Array.from({ length: count }, () => ({
        top: Math.random() * height,
        left: Math.random() * width,
        size: Math.random() < 0.85 ? 1.5 : 2.5,
        opacity: 0.4 + Math.random() * 0.6,
    }));
}

/** Scaled height for `rootBg.png` at a given layout width (preserves aspect ratio, no stretch). */
function getRootBgDisplayHeight(layoutWidth: number) {
    const meta = Image.resolveAssetSource(ROOT_BG_SOURCE);
    if (!meta?.width || !meta.height) {
        return layoutWidth * 0.75;
    }
    return (layoutWidth / meta.width) * meta.height;
}

type StarrySkyProps = {
    count?: number;
    width: number;
    height: number;
};

export function StarrySky({ count = 80, width, height }: StarrySkyProps) {
    const stars = useMemo(() => makeStars(count, width, height), [count, width, height]);

    return (
        <View
            className="bg-night"
            style={{ width, height, position: "relative", overflow: "hidden" }}
        >
            {stars.map((star, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            position: "absolute",
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            borderRadius: star.size / 2,
                            backgroundColor: "#fff",
                            opacity: star.opacity,
                        }}
                    />
                );
            })}
        </View>
    );
}

export type AlarmScreenStarrySkyProps = {
    /**
     * Minimum total height the scroll section needs behind the foreground.
     * The hero image uses its natural aspect height; remaining space is filled with `StarrySky`.
     */
    scrollMinHeight: number;
};

/**
 * Hero image at intrinsic aspect ratio, then procedural stars — both scroll with the page.
 */
export function AlarmScreenStarrySky({ scrollMinHeight }: AlarmScreenStarrySkyProps) {
    const { width } = useWindowDimensions();
    const heroHeight = getRootBgDisplayHeight(width);
    const starFieldHeight = Math.max(240, scrollMinHeight - heroHeight);
    const totalHeight = heroHeight + starFieldHeight;

    return (
        <View
            pointerEvents="none"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width,
                height: totalHeight,
                overflow: "hidden",
            }}
        >
            <Image
                source={ROOT_BG_SOURCE}
                resizeMode="contain"
                style={{ width, height: heroHeight }}
            />
            <StarrySky width={width} height={starFieldHeight} />
        </View>
    );
}
