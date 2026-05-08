import { AlarmScreenStarrySky } from "@/src/components/StarrySky"
import { Text, View } from "react-native"
export default function Alarm() {
    return (
        <View className="flex-1 bg-night"
        >
            <AlarmScreenStarrySky />
            <Text className="text-star mt-20 text-center">Alarm</Text>
        </View>
    )
}