import { StyleSheet, Switch, Text, View } from "react-native"

const SWITCH_TRACK_OFF = "rgba(255, 255, 255, 0.14)"
const SWITCH_TRACK_ON = "#d321b6"
const SWITCH_THUMB = "#ffffff"

export type AlarmSettingsTogglesProps = {
    snoozeEnabled: boolean
    onSnoozeChange: (value: boolean) => void
    alarmSoundEnabled: boolean
    onAlarmSoundChange: (value: boolean) => void
}

export function AlarmSettingsToggles({
    snoozeEnabled,
    onSnoozeChange,
    alarmSoundEnabled,
    onAlarmSoundChange,
}: AlarmSettingsTogglesProps) {
    return (
        <View className="px-8">
            <View className="flex-row items-center justify-between py-3.5">
                <Text className="font-sans text-lg font-medium text-star">Snooze</Text>
                <Switch
                    value={snoozeEnabled}
                    onValueChange={onSnoozeChange}
                    trackColor={{ false: SWITCH_TRACK_OFF, true: SWITCH_TRACK_ON }}
                    thumbColor={SWITCH_THUMB}
                    ios_backgroundColor={SWITCH_TRACK_OFF}
                />
            </View>
            <View style={styles.divider} />
            <View className="flex-row items-center justify-between py-3.5">
                <Text className="font-sans text-lg font-medium text-star">Alarm Sound</Text>
                <Switch
                    value={alarmSoundEnabled}
                    onValueChange={onAlarmSoundChange}
                    trackColor={{ false: SWITCH_TRACK_OFF, true: SWITCH_TRACK_ON }}
                    thumbColor={SWITCH_THUMB}
                    ios_backgroundColor={SWITCH_TRACK_OFF}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "rgba(255, 255, 255, 0.18)",
    },
})
