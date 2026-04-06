import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import ProfileCard from '@/components/match/ProfileCard';

export default function HomeScreen() {
  const { matches, likedUsers, likeUser, unlikeUser, matchType, setMatchType, getRemainingLikes, membership } = useStore();
  const [showFilter, setShowFilter] = useState(false);
  const [alert, setAlert] = useState('');

  return (
    <View style={styles.container}>
      {/* Match Type Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, matchType === 'general' && styles.toggleActive]}
          onPress={() => setMatchType('general')}
        >
          <FontAwesome
            name="heart"
            size={14}
            color={matchType === 'general' ? COLORS.white : COLORS.primary}
          />
          <Text style={[styles.toggleText, matchType === 'general' && styles.toggleTextActive]}>
            일반 매칭
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, matchType === 'remarriage' && styles.toggleActiveRemarriage]}
          onPress={() => setMatchType('remarriage')}
        >
          <FontAwesome
            name="refresh"
            size={14}
            color={matchType === 'remarriage' ? COLORS.white : COLORS.remarriage}
          />
          <Text
            style={[
              styles.toggleText,
              { color: COLORS.remarriage },
              matchType === 'remarriage' && styles.toggleTextActive,
            ]}
          >
            재혼 매칭
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alert */}
      {alert ? (
        <View style={{ backgroundColor: COLORS.primary, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="lock" size={14} color={COLORS.white} />
          <Text style={{ flex: 1, color: COLORS.white, fontSize: SIZES.sm }}>{alert}</Text>
        </View>
      ) : null}

      {/* Match Count + Remaining Likes */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          추천 매칭 <Text style={styles.countNumber}>{matches.length}명</Text>
        </Text>
        <Text style={{ fontSize: SIZES.xs, color: COLORS.textLight }}>
          남은 좋아요: {getRemainingLikes()}회
        </Text>
      </View>

      {/* Match List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {matches.length === 0 ? (
          <View style={styles.empty}>
            <FontAwesome name="search" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>매칭 결과가 없습니다</Text>
            <Text style={styles.emptyText}>
              {matchType === 'remarriage'
                ? '현재 재혼 매칭 가능한 상대가 없습니다'
                : '조건에 맞는 상대를 찾고 있습니다'}
            </Text>
          </View>
        ) : (
          matches.map((match) => (
            <ProfileCard
              key={match.user.id}
              match={match}
              isLiked={likedUsers.includes(match.user.id)}
              onPress={() => router.push(`/match/${match.user.id}`)}
              onLike={() => {
                if (likedUsers.includes(match.user.id)) {
                  unlikeUser(match.user.id);
                } else {
                  const result = likeUser(match.user.id);
                  if (!result.success && result.message) {
                    setAlert(result.message);
                    setTimeout(() => setAlert(''), 4000);
                  }
                }
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: SIZES.padding,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleActiveRemarriage: {
    backgroundColor: COLORS.remarriage,
    borderColor: COLORS.remarriage,
  },
  toggleText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  countNumber: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: SIZES.padding,
    paddingBottom: 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
});
