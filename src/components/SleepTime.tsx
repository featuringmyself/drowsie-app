import { Text, View } from "react-native"

export default function SleepTime() {
    return (
        <View className="mt-[32vh]">
            <Text className="font-sans text-gray text-center text-lg font-medium">Sleep Time</Text>
            <Text className="font-sans text-star text-2xl font-medium text-center mt-2"><Text className="text-6xl font-semibold">07</Text>hr<Text className="text-6xl font-semibold">30</Text>min</Text>
        </View>
    )
}