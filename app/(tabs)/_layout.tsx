import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        headerStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '매칭',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          headerTitle: 'AI 매치메이커',
          headerTitleStyle: { fontWeight: 'bold', color: COLORS.primary },
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: 'AI 추천',
          tabBarIcon: ({ color }) => <TabBarIcon name="magic" color={color} />,
          headerTitle: 'AI 이상형 매칭',
          headerTitleStyle: { fontWeight: 'bold', color: COLORS.primary },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '통계',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          headerTitle: '매칭 성공률',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내 정보',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      {/* Hide unused tabs */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="two" options={{ href: null }} />
      <Tabs.Screen name="matches" options={{ href: null }} />
    </Tabs>
  );
}
