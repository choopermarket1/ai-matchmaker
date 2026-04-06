import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';

export default function LandingScreen() {
  const isLoggedIn = useStore((s) => s.isLoggedIn);

  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)/home');
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <FontAwesome name="heart" size={60} color={COLORS.white} />
        </View>
        <Text style={styles.title}>AI 매치메이커</Text>
        <Text style={styles.subtitle}>
          AI가 분석하는 완벽한 인연{'\n'}
          당신의 소울메이트를 찾아드립니다
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <FontAwesome name="magic" size={20} color={COLORS.primary} />
          <Text style={styles.featureText}>AI 기반 매칭 알고리즘</Text>
        </View>
        <View style={styles.feature}>
          <FontAwesome name="shield" size={20} color={COLORS.secondary} />
          <Text style={styles.featureText}>검증된 프로필만</Text>
        </View>
        <View style={styles.feature}>
          <FontAwesome name="refresh" size={20} color={COLORS.remarriage} />
          <Text style={styles.featureText}>재혼 매칭 지원</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.primaryButtonText}>시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.secondaryButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        SNS 프로필 기반 • MBTI 궁합 분석 • 취미 매칭
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: 12,
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: SIZES.radius,
  },
  featureText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  buttons: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: SIZES.sm,
  },
});
