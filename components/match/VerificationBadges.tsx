import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Verification, VERIFICATION_LABELS } from '@/lib/types';
import { COLORS, SIZES } from '@/constants/theme';

interface Props {
  verification: Verification;
  compact?: boolean;
}

const ICONS: Record<string, string> = {
  identity: 'id-card',
  maritalStatus: 'check-circle',
  job: 'briefcase',
  education: 'graduation-cap',
  photo: 'camera',
  income: 'won',
};

export default function VerificationBadges({ verification, compact }: Props) {
  const entries = Object.entries(verification) as [keyof Verification, string][];
  const verifiedCount = entries.filter(([, v]) => v === 'verified').length;

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <FontAwesome name="shield" size={12} color={COLORS.success} />
        <Text style={styles.compactText}>
          인증 {verifiedCount}/{entries.length}
        </Text>
        {verifiedCount === entries.length && (
          <View style={styles.allVerifiedBadge}>
            <Text style={styles.allVerifiedText}>완전인증</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>인증 현황</Text>
      <View style={styles.grid}>
        {entries.map(([key, status]) => (
          <View
            key={key}
            style={[
              styles.badge,
              status === 'verified' && styles.badgeVerified,
              status === 'pending' && styles.badgePending,
            ]}
          >
            <FontAwesome
              name={ICONS[key] as any}
              size={14}
              color={
                status === 'verified' ? COLORS.success
                : status === 'pending' ? COLORS.warning
                : COLORS.textLight
              }
            />
            <Text
              style={[
                styles.badgeText,
                status === 'verified' && styles.badgeTextVerified,
                status === 'pending' && styles.badgeTextPending,
              ]}
            >
              {VERIFICATION_LABELS[key]}
            </Text>
            {status === 'verified' && (
              <FontAwesome name="check" size={10} color={COLORS.success} />
            )}
            {status === 'pending' && (
              <FontAwesome name="clock-o" size={10} color={COLORS.warning} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: SIZES.padding },
  title: {
    fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  badgeVerified: {
    backgroundColor: COLORS.success + '10', borderColor: COLORS.success + '40',
  },
  badgePending: {
    backgroundColor: COLORS.warning + '10', borderColor: COLORS.warning + '40',
  },
  badgeText: { fontSize: SIZES.sm, color: COLORS.textLight },
  badgeTextVerified: { color: COLORS.success, fontWeight: '500' },
  badgeTextPending: { color: COLORS.warning, fontWeight: '500' },
  compactRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  compactText: { fontSize: SIZES.xs, color: COLORS.success, fontWeight: '500' },
  allVerifiedBadge: {
    backgroundColor: COLORS.success, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6,
  },
  allVerifiedText: { fontSize: 9, color: COLORS.white, fontWeight: 'bold' },
});
