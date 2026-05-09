import { Text, View } from "react-native"

export default function SleepTime() {
    return (
        <View className="mt-[32vh]">
            <Text className="font-sans text-gray text-center text-lg font-medium">Sleep Time</Text>
            <View className="mt-2 flex-row items-baseline justify-center">
                <Text className="font-sans text-6xl font-semibold text-star" style={{ lineHeight: 64 }}>07</Text>
                <Text className="font-sans text-2xl font-medium text-star" style={{ lineHeight: 28 }}>hr</Text>
                <Text className="font-sans ml-1 text-6xl font-semibold text-star" style={{ lineHeight: 64 }}>30</Text>
                <Text className="font-sans text-2xl font-medium text-star" style={{ lineHeight: 28 }}>min</Text>
            </View>
        </View>
    )
}