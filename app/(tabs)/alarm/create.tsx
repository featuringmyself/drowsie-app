import { StarrySky } from "@/src/components/StarrySky"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const CARD_RADIUS = 28
const CARD_MIN_HEIGHT = 90

export default function CreateAlarm() {
    const { width, height } = useWindowDimensions()
    return (
        <View className="flex-1 bg-night">
            <View style={StyleSheet.absoluteFill}>
                <StarrySky width={width} height={height} />
            </View>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1">
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
                                    <Text className="font-sans text-3xl font-semibold text-star">23:00</Text>
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
                                    <Text className="font-sans text-3xl font-semibold text-star">07:00</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}