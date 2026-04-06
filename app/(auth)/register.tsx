import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FontAwesome name="user-plus" size={60} color={COLORS.primary} />
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.description}>
          프로토타입 버전에서는{'\n'}
          데모 계정으로 체험하실 수 있습니다.{'\n\n'}
          정식 버전에서는 SNS 연동을 통한{'\n'}
          회원가입이 지원될 예정입니다.
        </Text>

        <View style={styles.snsButtons}>
          <TouchableOpacity style={[styles.snsButton, { backgroundColor: '#E1306C' }]}>
            <FontAwesome name="instagram" size={20} color={COLORS.white} />
            <Text style={styles.snsText}>Instagram으로 가입</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.snsButton, { backgroundColor: '#1877F2' }]}>
            <FontAwesome name="facebook" size={20} color={COLORS.white} />
            <Text style={styles.snsText}>Facebook으로 가입</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.snsButton, { backgroundColor: '#000000' }]}>
            <FontAwesome name="at" size={20} color={COLORS.white} />
            <Text style={styles.snsText}>Threads로 가입</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.notice}>
          * SNS 연동은 정식 버전에서 제공됩니다
        </Text>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.demoButtonText}>데모 계정으로 시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  snsButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  snsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    opacity: 0.5,
  },
  snsText: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  notice: {
    color: COLORS.textLight,
    fontSize: SIZES.sm,
    marginBottom: 24,
  },
  demoButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: SIZES.radius,
  },
  demoButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
});
