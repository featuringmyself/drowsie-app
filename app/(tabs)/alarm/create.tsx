import { StarrySky } from "@/src/components/StarrySky"
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function CreateAlarm() {
    const { width, height } = useWindowDimensions()
    return (
        <View className="flex-1 bg-night">
            <View style={StyleSheet.absoluteFill}>
                <StarrySky width={width} height={height} />
            </View>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1">
                    <Text className="font-sans text-star mt-4 text-center text-3xl font-medium">New Alarm</Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}