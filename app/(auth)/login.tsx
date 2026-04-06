import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { mockUsers } from '@/lib/mockData';

export default function LoginScreen() {
  const login = useStore((s) => s.login);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleDemoLogin = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      login(user);
      router.replace('/(tabs)/home');
    }
  };

  // Show first 6 users as demo accounts
  const demoUsers = mockUsers.slice(0, 6);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <FontAwesome name="heart" size={40} color={COLORS.primary} />
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>데모 계정으로 체험해보세요</Text>
      </View>

      <Text style={styles.sectionTitle}>데모 계정 선택</Text>

      <View style={styles.demoGrid}>
        {demoUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.demoCard,
              selectedUser === user.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedUser(user.id)}
          >
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            <Text style={styles.demoName}>{user.name}</Text>
            <Text style={styles.demoInfo}>
              {user.age}세 • {user.gender === 'male' ? '남' : '여'}
            </Text>
            <Text style={styles.demoMbti}>{user.mbti}</Text>
            {user.matchType === 'remarriage' && (
              <View style={styles.remarriageBadge}>
                <Text style={styles.remarriageText}>재혼</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          !selectedUser && styles.loginButtonDisabled,
        ]}
        disabled={!selectedUser}
        onPress={() => selectedUser && handleDemoLogin(selectedUser)}
      >
        <Text style={styles.loginButtonText}>
          {selectedUser ? '이 계정으로 시작하기' : '계정을 선택하세요'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.push('/(auth)/register')}
      >
        <Text style={styles.registerText}>
          새 프로필로 시작하기 →
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SIZES.padding * 1.5,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  demoCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  demoName: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  demoInfo: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  demoMbti: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  remarriageBadge: {
    backgroundColor: COLORS.remarriage,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  remarriageText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
  },
  registerText: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
});
