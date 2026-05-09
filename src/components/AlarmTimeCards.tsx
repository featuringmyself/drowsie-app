import Ionicons from "@expo/vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"
import { Text, View } from "react-native"

const CARD_RADIUS = 28
const CARD_MIN_HEIGHT = 90

function pad2(n: number) {
    return n.toString().padStart(2, "0")
}

function formatClock(d: Date) {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

type AlarmTimeCardsProps = {
    bedTime: Date
    wakeTime: Date
}

export function AlarmTimeCards({ bedTime, wakeTime }: AlarmTimeCardsProps) {
    return (
        <>
            <Text className="font-sans text-star mt-4 text-center text-3xl font-medium">Time</Text>
            <View className="mt-8 flex-row gap-3 px-8">
                <LinearGradient
                    colors={["#f0dff5", "#d321b6"]}
                    locations={[0, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: CARD_MIN_HEIGHT,
                        borderRadius: CARD_RADIUS,
                        padding: 10,
                    }}
                >
                    <View className="h-full flex-1 flex-col justify-between">
                        <View className="flex-row items-center justify-center gap-2">
                            <Ionicons name="moon" size={18} color="#fff" />
                            <Text className="font-sans text-lg font-medium text-star">Bedtime</Text>
                        </View>
                        <View className="items-center">
                            <Text className="font-sans text-3xl font-semibold text-star">{formatClock(bedTime)}</Text>
                        </View>
                    </View>
                </LinearGradient>
                <LinearGradient
                    colors={["#0c0c0f", "#1f1f26"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: CARD_MIN_HEIGHT,
                        borderRadius: CARD_RADIUS,
                        padding: 10,
                    }}
                >
                    <View className="h-full flex-1 flex-col justify-between">
                        <View className="flex-row items-center justify-center gap-2">
                            <Ionicons name="sunny-outline" size={18} color="#fff" />
                            <Text className="font-sans text-lg font-medium text-gray">Wake Up</Text>
                        </View>
                        <View className="items-center">
                            <Text className="font-sans text-3xl font-semibold text-star">{formatClock(wakeTime)}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </>
    )
}
