import { AlarmSettingsToggles } from "@/src/components/AlarmSettingsToggles"
import { CreateAlarmChrome } from "@/src/components/CreateAlarmChrome"
import { RadialAlarmSetter } from "@/src/components/RadialAlarmSetter"
import { useMemo, useState } from "react"
import { useWindowDimensions, View } from "react-native"

export default function CreateAlarm() {
    const { width, height } = useWindowDimensions()

    const [bedTime] = useState(() => {
        const d = new Date()
        d.setSeconds(0, 0)
        return d
    })

    const [wakeTime, setWakeTime] = useState(() => {
        const w = new Date(bedTime.getTime() + 6 * 60 * 60_000)
        w.setSeconds(0, 0)
        return w
    })

    const [snoozeEnabled, setSnoozeEnabled] = useState(false)
    const [alarmSoundEnabled, setAlarmSoundEnabled] = useState(true)

    const dialSize = useMemo(() => Math.min(width - 36, height * 0.48, 352), [width, height])

    return (
        <View className="flex-1 bg-night">
            <CreateAlarmChrome width={width} height={height} bedTime={bedTime} wakeTime={wakeTime}>
                <View className="mt-10 items-center">
                    <RadialAlarmSetter
                        size={dialSize}
                        bedTime={bedTime}
                        wakeTime={wakeTime}
                        onWakeTimeChange={setWakeTime}
                    />
                </View>

                <View className="mt-8 pb-12">
                    <AlarmSettingsToggles
                        snoozeEnabled={snoozeEnabled}
                        onSnoozeChange={setSnoozeEnabled}
                        alarmSoundEnabled={alarmSoundEnabled}
                        onAlarmSoundChange={setAlarmSoundEnabled}
                    />
                </View>
            </CreateAlarmChrome>
        </View>
    )
}
