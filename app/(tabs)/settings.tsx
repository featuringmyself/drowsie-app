import { StarrySky } from "@/src/components/StarrySky";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
    const { width, height } = useWindowDimensions();
    return (
        <View className="flex-1 bg-night">
            <View style={StyleSheet.absoluteFill}>
                <StarrySky width={width} height={height} />
            </View>
            <SafeAreaView className="relative z-10">
                <Text className="font-sans text-star mt-4 text-center text-3xl font-medium">Settings</Text>
            </SafeAreaView>
        </View>
    )
}