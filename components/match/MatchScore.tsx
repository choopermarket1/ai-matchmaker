import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

interface Props {
  breakdown: Record<string, number | undefined>;
  totalScore: number;
}

const LABELS: Record<string, string> = {
  mbti: 'MBTI 궁합',
  job: '직업군 궁합',
  hobbies: '취미 일치',
  region: '지역 근접',
  education: '학력 유사',
  income: '소득 유사',
  age: '나이 적합',
  lifestyle: '생활패턴',
  verification: '인증 신뢰도',
  remarriage: '재혼 호환성',
};

const WEIGHTS_GENERAL: Record<string, number> = {
  mbti: 20, job: 15, hobbies: 15, region: 12,
  education: 10, income: 8, age: 10, lifestyle: 5, verification: 5,
};
const WEIGHTS_REMARRIAGE: Record<string, number> = {
  mbti: 12, job: 15, hobbies: 10, region: 12,
  education: 8, income: 10, age: 5, lifestyle: 8, verification: 5, remarriage: 15,
};

export default function MatchScore({ breakdown, totalScore }: Props) {
  const hasRemarriage = breakdown.remarriage !== undefined;
  const weights = hasRemarriage ? WEIGHTS_REMARRIAGE : WEIGHTS_GENERAL;

  const getBarColor = (score: number) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.secondary;
    if (score >= 40) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>종합 매칭 점수</Text>
        <Text style={[styles.totalScore, { color: getBarColor(totalScore) }]}>
          {totalScore}%
        </Text>
      </View>
      {Object.entries(breakdown).map(([key, value]) => {
        if (value === undefined) return null;
        return (
          <View key={key} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{LABELS[key] || key}</Text>
              <Text style={styles.weight}>({weights[key] || 0}%)</Text>
              <Text style={[styles.value, { color: getBarColor(value) }]}>{value}점</Text>
            </View>
            <View style={styles.barBg}>
              <View
                style={[styles.bar, { width: `${value}%`, backgroundColor: getBarColor(value) }]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: SIZES.padding },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  totalLabel: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text },
  totalScore: { fontSize: SIZES.xxxl, fontWeight: 'bold' },
  row: { marginBottom: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 },
  label: { fontSize: SIZES.md, color: COLORS.text, fontWeight: '500' },
  weight: { fontSize: SIZES.xs, color: COLORS.textLight, flex: 1 },
  value: { fontSize: SIZES.md, fontWeight: '600' },
  barBg: { height: 8, backgroundColor: COLORS.surface, borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 4 },
});
