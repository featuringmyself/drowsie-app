import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

type AlarmItem = {
    id: string;
    hour: number;
    minute: number;
    repeatLabel: string;
    enabled: boolean;
};

const INITIAL_ALARMS: AlarmItem[] = [
    {
        id: "1",
        hour: 8,
        minute: 0,
        repeatLabel: "Mon-Fri",
        enabled: true,
    },
    {
        id: "2",
        hour: 16,
        minute: 0,
        repeatLabel: "Every weekdays",
        enabled: false,
    },
    {
        id: "3",
        hour: 16,
        minute: 0,
        repeatLabel: "Every weekdays",
        enabled: false,
    },
    {
        id: "4",
        hour: 16,
        minute: 0,
        repeatLabel: "Every weekdays",
        enabled: false,
    },
];

function formatTimeParts(hour: number, minute: number) {
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? "AM" : "PM";
    const hh = String(h12).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return { time: `${hh}:${mm}`, period };
}

function AlarmToggle({
    value,
    onValueChange,
}: {
    value: boolean;
    onValueChange: (next: boolean) => void;
}) {
    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
            className="active:opacity-90"
        >
            <View
                className="h-8 w-[52px] justify-center overflow-hidden rounded-full p-0.5"
                style={{ position: "relative" }}
            >
                <View
                    pointerEvents="none"
                    className="absolute inset-0 rounded-full"
                    style={{
                        backgroundColor: value ? "#d946ef" : "rgba(255, 255, 255, 0.1)",
                    }}
                />
                <View
                    className="h-[27px] w-[27px] rounded-full bg-star"
                    style={{ alignSelf: value ? "flex-end" : "flex-start" }}
                />
            </View>
        </Pressable>
    );
}

function AlarmCard({
    item,
    onToggle,
}: {
    item: AlarmItem;
    onToggle: (id: string, enabled: boolean) => void;
}) {
    const { time, period } = formatTimeParts(item.hour, item.minute);

    return (
        <LinearGradient
            colors={["#2d2433", "#1e1926"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                marginBottom: 12,
                borderRadius: 24,
                paddingHorizontal: 20,
                paddingVertical: 20,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View className="min-w-0 flex-1">
                <View className="flex-row items-center">
                    <Text className="font-sans text-[2rem] font-bold text-star">{time}</Text>
                    <Text className="font-sans ml-1 text-sm font-normal text-star">{period}</Text>
                </View>
                <Text
                    className="font-sans mt-1 text-base font-normal"
                    style={{ color: "#9ca3af" }}
                >
                    {item.repeatLabel}
                </Text>
            </View>
            <AlarmToggle value={item.enabled} onValueChange={(v) => onToggle(item.id, v)} />
        </LinearGradient>
    );
}

export default function AlarmList() {
    const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);

    const handleToggle = useCallback((id: string, enabled: boolean) => {
        setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled } : a)));
    }, []);

    return (
        <View className="mt-10 px-5 pb-8">
            <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-medium text-star">Alarm</Text>
                <Pressable hitSlop={8}>
                    <Text className="text-sm font-medium text-star">See all</Text>
                </Pressable>
            </View>
            {alarms.map((item) => (
                <AlarmCard key={item.id} item={item} onToggle={handleToggle} />
            ))}
        </View>
    );
}
