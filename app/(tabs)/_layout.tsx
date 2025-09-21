import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.lightBlue,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="calendar-month" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddItem"
        options={{
          title: "AddItem",
          tabBarIcon: ({ color }) => (
            <Ionicons size={30} name="add-circle-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <Ionicons
              size={28}
              name="chatbubble-ellipses-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person-circle-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
