import { useMemo } from "react";
import {
    Image,
    StyleSheet,
    useWindowDimensions,
    View
} from "react-native";

function makeStars(count: number, width: number, height: number) {
    return Array.from({ length: count }, () => ({
        top: Math.random() * height,
        left: Math.random() * width,
        size: Math.random() < 0.85 ? 1.5 : 2.5,
        opacity: 0.4 + Math.random() * 0.6,

    }))
}

type StarrySkyProps = {
    count?: number;
    /** Star field size; defaults to the current window. */
    width?: number;
    height?: number;
};

export function StarrySky({ count = 80, width: widthProp, height: heightProp }: StarrySkyProps) {
    const { width: winW, height: winH } = useWindowDimensions();
    const width = widthProp ?? winW;
    const height = heightProp ?? winH;
    const stars = useMemo(() => makeStars(count, width, height), [count, width, height]);

    return (
        <View className="absolute inset-0 bg-night">
            {stars.map((star, index) => {
                return <View
                    key={index}
                    style={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        borderRadius: star.size / 2,
                        backgroundColor: '#fff',
                        opacity: star.opacity,
                    }}
                />
            })}

        </View>
    )
}


export function AlarmScreenStarrySky() {
    const { width, height } = useWindowDimensions();
    return (
        <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
            <Image
                source={require('@/assets/images/rootBg.png')}
                resizeMode="cover"
                style={{ width, height }}
            />
        </View>
    );
}