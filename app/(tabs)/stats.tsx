import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { getMatchStats } from '@/lib/aiMatching';

export default function StatsScreen() {
  const stats = getMatchStats();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Stats */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>매칭 성공률 통계</Text>
        <Text style={styles.heroSubtitle}>AI 매치메이커 알고리즘 성과</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: COLORS.primary + '10' }]}>
          <FontAwesome name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.totalMatches.toLocaleString()}</Text>
          <Text style={styles.statLabel}>총 매칭 수</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.success + '10' }]}>
          <FontAwesome name="calendar-check-o" size={24} color={COLORS.success} />
          <Text style={[styles.statNumber, { color: COLORS.success }]}>{stats.threeMonthRate}%</Text>
          <Text style={styles.statLabel}>3개월 이상 만남</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.secondary + '10' }]}>
          <FontAwesome name="diamond" size={24} color={COLORS.secondary} />
          <Text style={[styles.statNumber, { color: COLORS.secondary }]}>{stats.sixMonthRate}%</Text>
          <Text style={styles.statLabel}>6개월 이상 만남</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.remarriage + '10' }]}>
          <FontAwesome name="ring" size={24} color={COLORS.remarriage} />
          <Text style={[styles.statNumber, { color: COLORS.remarriage }]}>{stats.marriageRate}%</Text>
          <Text style={styles.statLabel}>결혼/약혼</Text>
        </View>
      </View>

      {/* Score Range Success */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>매칭 점수별 성공률</Text>
        <Text style={styles.sectionDesc}>점수가 높을수록 3개월 이상 만남 확률이 올라갑니다</Text>
        {stats.scoreRangeStats.map((item) => (
          <View key={item.range} style={styles.rangeRow}>
            <Text style={styles.rangeLabel}>{item.range}</Text>
            <View style={styles.rangeBarBg}>
              <View
                style={[
                  styles.rangeBar,
                  {
                    width: `${item.successRate}%`,
                    backgroundColor: item.successRate >= 70 ? COLORS.success
                      : item.successRate >= 50 ? COLORS.secondary
                      : item.successRate >= 30 ? COLORS.warning
                      : COLORS.error,
                  },
                ]}
              />
            </View>
            <Text style={styles.rangeValue}>{item.successRate}%</Text>
          </View>
        ))}
      </View>

      {/* Success Factors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>성공 커플 공통 요인 TOP 5</Text>
        <Text style={styles.sectionDesc}>3개월 이상 만남을 유지한 커플들의 공통점</Text>
        {stats.topFactors.map((factor, idx) => (
          <View key={idx} style={styles.factorRow}>
            <View style={styles.factorRank}>
              <Text style={styles.factorRankText}>{idx + 1}</Text>
            </View>
            <Text style={styles.factorText}>{factor}</Text>
          </View>
        ))}
      </View>

      {/* Trust Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>신뢰 지표</Text>
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <FontAwesome name="shield" size={28} color={COLORS.success} />
            <Text style={styles.trustNumber}>100%</Text>
            <Text style={styles.trustLabel}>본인인증 완료</Text>
          </View>
          <View style={styles.trustItem}>
            <FontAwesome name="ban" size={28} color={COLORS.primary} />
            <Text style={styles.trustNumber}>0명</Text>
            <Text style={styles.trustLabel}>기혼자 프로필</Text>
          </View>
          <View style={styles.trustItem}>
            <FontAwesome name="camera" size={28} color={COLORS.secondary} />
            <Text style={styles.trustNumber}>100%</Text>
            <Text style={styles.trustLabel}>사진 인증</Text>
          </View>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        * 통계는 서비스 출시 이후 누적 데이터 기준이며, 매월 업데이트됩니다.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { paddingBottom: 40 },
  heroSection: {
    backgroundColor: COLORS.primary, padding: 24, alignItems: 'center',
  },
  heroTitle: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.white },
  heroSubtitle: { fontSize: SIZES.md, color: COLORS.white + 'CC', marginTop: 4 },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    padding: SIZES.padding, marginTop: -12,
  },
  statCard: {
    width: '47%', alignItems: 'center', padding: 16,
    borderRadius: SIZES.radius, ...SHADOWS.small, backgroundColor: COLORS.white,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginTop: 8 },
  statLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },

  section: {
    backgroundColor: COLORS.white, padding: SIZES.padding, marginTop: 8,
  },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  sectionDesc: { fontSize: SIZES.sm, color: COLORS.textLight, marginBottom: 16 },

  rangeRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8,
  },
  rangeLabel: { width: 80, fontSize: SIZES.sm, color: COLORS.text, fontWeight: '500' },
  rangeBarBg: {
    flex: 1, height: 16, backgroundColor: COLORS.surface, borderRadius: 8, overflow: 'hidden',
  },
  rangeBar: { height: '100%', borderRadius: 8 },
  rangeValue: { width: 42, fontSize: SIZES.sm, fontWeight: '600', color: COLORS.text, textAlign: 'right' },

  factorRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.surface,
  },
  factorRank: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  factorRankText: { color: COLORS.white, fontWeight: 'bold', fontSize: SIZES.sm },
  factorText: { flex: 1, fontSize: SIZES.md, color: COLORS.text },

  trustGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  trustItem: { alignItems: 'center', gap: 6 },
  trustNumber: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  trustLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary },

  disclaimer: {
    fontSize: SIZES.xs, color: COLORS.textLight, textAlign: 'center',
    padding: SIZES.padding, paddingTop: 16,
  },
});
