import AlarmList from "@/src/components/AlarmList"
import SleepTime from "@/src/components/SleepTime"
import { AlarmScreenStarrySky } from "@/src/components/StarrySky"
import { useEffect, useState } from "react"
import type { LayoutChangeEvent } from "react-native"
import { ScrollView, Text, View, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Alarm() {
    const { height: windowHeight } = useWindowDimensions()
    const [scrollMinHeight, setScrollMinHeight] = useState(windowHeight)

    useEffect(() => {
        setScrollMinHeight((h) => Math.max(h, windowHeight))
    }, [windowHeight])

    const onScrollSectionLayout = (e: LayoutChangeEvent) => {
        const laidOutHeight = e.nativeEvent.layout.height
        setScrollMinHeight((prev) => Math.max(prev, windowHeight, laidOutHeight))
    }

    return (
        <ScrollView
            className="flex-1 bg-night"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
            bounces
        >
            <View
                className="relative w-full bg-night"
                style={{ minHeight: windowHeight }}
                onLayout={onScrollSectionLayout}
            >
                <AlarmScreenStarrySky scrollMinHeight={scrollMinHeight} />
                <SafeAreaView className="relative z-10">
                    <Text className="font-sans text-star mt-4 text-center text-3xl font-medium">Alarm</Text>
                    <SleepTime />
                    <AlarmList />
                </SafeAreaView>
            </View>
        </ScrollView>
    )
}
