import SleepTime from "@/src/components/SleepTime"
import { AlarmScreenStarrySky } from "@/src/components/StarrySky"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
export default function Alarm() {
    return (
        <View className="flex-1 bg-night"
        >
            <AlarmScreenStarrySky />
            <SafeAreaView>
                <Text className="font-sans text-star mt-4 text-center text-3xl font-medium">Alarm</Text>
                <SleepTime />
            </SafeAreaView>
        </View>
    )
}