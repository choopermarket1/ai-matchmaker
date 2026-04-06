import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { mockUsers } from '@/lib/mockData';
import { calculateMatch } from '@/lib/matching';
import MatchScore from '@/components/match/MatchScore';
import VerificationBadges from '@/components/match/VerificationBadges';
import {
  REGION_LABELS, EDUCATION_LABELS, INCOME_LABELS, HOBBY_LABELS, JOB_CATEGORY_LABELS,
} from '@/lib/types';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, likedUsers, likeUser, unlikeUser } = useStore();

  const targetUser = mockUsers.find((u) => u.id === id);
  if (!targetUser || !currentUser) {
    return (
      <View style={styles.center}>
        <Text>사용자를 찾을 수 없습니다</Text>
      </View>
    );
  }

  const matchResult = calculateMatch(currentUser, targetUser);
  const isLiked = likedUsers.includes(targetUser.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Image */}
      <View style={styles.imageSection}>
        <Image source={{ uri: targetUser.profileImage }} style={styles.image} />
        {targetUser.matchType === 'remarriage' && (
          <View style={styles.remarriageBadge}>
            <FontAwesome name="refresh" size={12} color={COLORS.white} />
            <Text style={styles.remarriageLabel}>재혼 매칭</Text>
          </View>
        )}
      </View>

      {/* Basic Info */}
      <View style={styles.basicInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{targetUser.name}</Text>
          <Text style={styles.age}>{targetUser.age}세</Text>
        </View>
        <Text style={styles.job}>
          {JOB_CATEGORY_LABELS[targetUser.jobCategory]} • {targetUser.job}
        </Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{targetUser.mbti}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{REGION_LABELS[targetUser.region]}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{EDUCATION_LABELS[targetUser.education]}</Text>
          </View>
        </View>
      </View>

      {/* Verification Badges */}
      <View style={{ backgroundColor: COLORS.white, marginTop: 8 }}>
        <VerificationBadges verification={targetUser.verification} />
      </View>

      {/* Match Score */}
      <View style={styles.scoreSection}>
        <MatchScore breakdown={matchResult.breakdown} totalScore={matchResult.score} />
      </View>

      {/* Introduction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>자기소개</Text>
        <Text style={styles.introText}>{targetUser.introduction}</Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>상세 정보</Text>
        <DetailRow label="소득" value={INCOME_LABELS[targetUser.income]} />
        <DetailRow label="음주" value={
          targetUser.drinking === 'none' ? '안 함' :
          targetUser.drinking === 'sometimes' ? '가끔' : '자주'
        } />
        <DetailRow label="흡연" value={
          targetUser.smoking === 'no' ? '비흡연' :
          targetUser.smoking === 'yes' ? '흡연' : '금연'
        } />
      </View>

      {/* Hobbies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>취미 & 관심사</Text>
        <View style={styles.hobbies}>
          {targetUser.hobbies.map((h) => {
            const isCommon = currentUser.hobbies.includes(h);
            return (
              <View
                key={h}
                style={[styles.hobbyTag, isCommon && styles.commonHobby]}
              >
                {isCommon && <FontAwesome name="check" size={10} color={COLORS.success} />}
                <Text style={[styles.hobbyText, isCommon && styles.commonHobbyText]}>
                  {HOBBY_LABELS[h]}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.hobbyNote}>* 초록색은 공통 취미입니다</Text>
      </View>

      {/* Remarriage Info */}
      {targetUser.remarriageInfo && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.remarriage }]}>재혼 정보</Text>
          <DetailRow label="이혼 확인" value={targetUser.remarriageInfo.divorceConfirmed ? '확인됨' : '미확인'} />
          <DetailRow label="서약 동의" value={targetUser.remarriageInfo.divorceAgreementSigned ? '동의함' : '미동의'} />
          <DetailRow label="자녀" value={
            targetUser.remarriageInfo.hasChildren
              ? `${targetUser.remarriageInfo.childrenCount}명`
              : '없음'
          } />
          {targetUser.remarriageInfo.hasChildren && (
            <DetailRow label="양육권" value={targetUser.remarriageInfo.hasCustody ? '있음' : '없음'} />
          )}
        </View>
      )}

      {/* SNS */}
      {targetUser.snsProfiles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SNS 프로필</Text>
          {targetUser.snsProfiles.map((sns, i) => (
            <View key={i} style={styles.snsRow}>
              <FontAwesome
                name={sns.platform === 'instagram' ? 'instagram' : sns.platform === 'facebook' ? 'facebook' : 'at'}
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.snsUrl}>{sns.url}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.likeButton, isLiked && styles.likedButton]}
          onPress={() => isLiked ? unlikeUser(targetUser.id) : likeUser(targetUser.id)}
        >
          <FontAwesome
            name={isLiked ? 'heart' : 'heart-o'}
            size={22}
            color={isLiked ? COLORS.white : COLORS.heart}
          />
          <Text style={[styles.likeButtonText, isLiked && { color: COLORS.white }]}>
            {isLiked ? '좋아요 취소' : '좋아요'}
          </Text>
        </TouchableOpacity>

        {isLiked && (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              const room = useStore.getState().chatRooms.find(
                (r) => r.partnerId === targetUser.id
              );
              if (room) {
                router.push(`/chatroom/${room.id}`);
              }
            }}
          >
            <FontAwesome name="comment" size={22} color={COLORS.white} />
            <Text style={styles.chatButtonText}>채팅하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.border,
  },
  remarriageBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.remarriage,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  remarriageLabel: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  basicInfo: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  name: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  age: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
  },
  job: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  tag: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: COLORS.primaryDark,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  scoreSection: {
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  introText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  detailLabel: {
    width: 80,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  hobbies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  commonHobby: {
    backgroundColor: COLORS.success + '15',
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  hobbyText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  commonHobbyText: {
    color: COLORS.success,
    fontWeight: '500',
  },
  hobbyNote: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginTop: 8,
  },
  snsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  snsUrl: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: SIZES.padding,
    marginTop: 8,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.heart,
  },
  likedButton: {
    backgroundColor: COLORS.heart,
    borderColor: COLORS.heart,
  },
  likeButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.heart,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.secondary,
  },
  chatButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
