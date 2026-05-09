import { AlarmTimeCards } from "@/src/components/AlarmTimeCards"
import { StarrySky } from "@/src/components/StarrySky"
import { LinearGradient } from "expo-linear-gradient"
import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type CreateAlarmChromeProps = {
    width: number
    height: number
    bedTime: Date
    wakeTime: Date
    children: ReactNode
}

export function CreateAlarmChrome({ width, height, bedTime, wakeTime, children }: CreateAlarmChromeProps) {
    return (
        <>
            <LinearGradient
                colors={["#1a0b2e", "#000000", "#130414"]}
                locations={[0, 0.45, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <StarrySky width={width} height={height} count={100} />
            </View>
            <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
                <View className="flex-1">
                    <AlarmTimeCards bedTime={bedTime} wakeTime={wakeTime} />
                    {children}
                </View>
            </SafeAreaView>
        </>
    )
}
