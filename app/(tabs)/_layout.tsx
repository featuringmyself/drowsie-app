import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
        }
    }}>
        <Tabs.Screen
            name="index"
            options={{
                title: "Alarm", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="alarm" color={color} size={size} />
                ),
                tabBarActiveTintColor: '#ffffff',
            }}
        />
        <Tabs.Screen
            name="settings"
            options={{
                title: "Settings",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                ),
                tabBarActiveTintColor: '#ffffff',
            }}
        />
    </Tabs>
}