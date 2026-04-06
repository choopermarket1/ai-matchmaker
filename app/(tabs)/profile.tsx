import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import {
  REGION_LABELS, EDUCATION_LABELS, INCOME_LABELS, HOBBY_LABELS,
} from '@/lib/types';

export default function ProfileScreen() {
  const { currentUser, logout, likedUsers, chatRooms } = useStore();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: currentUser.profileImage }} style={styles.avatar} />
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.detail}>
          {currentUser.age}세 • {currentUser.gender === 'male' ? '남성' : '여성'} • {REGION_LABELS[currentUser.region]}
        </Text>
        {currentUser.matchType === 'remarriage' && (
          <View style={styles.remarriageBadge}>
            <FontAwesome name="refresh" size={12} color={COLORS.white} />
            <Text style={styles.remarriageText}>재혼 매칭</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{likedUsers.length}</Text>
          <Text style={styles.statLabel}>좋아요</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{chatRooms.length}</Text>
          <Text style={styles.statLabel}>채팅</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{currentUser.snsProfiles.length}</Text>
          <Text style={styles.statLabel}>SNS</Text>
        </View>
      </View>

      {/* Info Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기본 정보</Text>
        <View style={styles.infoGrid}>
          <InfoRow icon="id-badge" label="MBTI" value={currentUser.mbti} />
          <InfoRow icon="graduation-cap" label="학력" value={EDUCATION_LABELS[currentUser.education]} />
          <InfoRow icon="briefcase" label="직업" value={currentUser.job} />
          <InfoRow icon="won" label="소득" value={INCOME_LABELS[currentUser.income]} />
          <InfoRow icon="glass" label="음주" value={
            currentUser.drinking === 'none' ? '안 함' :
            currentUser.drinking === 'sometimes' ? '가끔' : '자주'
          } />
          <InfoRow icon="ban" label="흡연" value={
            currentUser.smoking === 'no' ? '비흡연' :
            currentUser.smoking === 'yes' ? '흡연' : '금연'
          } />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>취미 & 관심사</Text>
        <View style={styles.hobbies}>
          {currentUser.hobbies.map((h) => (
            <View key={h} style={styles.hobbyTag}>
              <Text style={styles.hobbyText}>{HOBBY_LABELS[h]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>자기소개</Text>
        <Text style={styles.introText}>{currentUser.introduction}</Text>
      </View>

      {currentUser.snsProfiles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SNS 프로필</Text>
          {currentUser.snsProfiles.map((sns, i) => (
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

      {/* Remarriage Info */}
      {currentUser.remarriageInfo && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.remarriage }]}>재혼 정보</Text>
          <InfoRow icon="check-circle" label="이혼 확인" value={currentUser.remarriageInfo.divorceConfirmed ? '확인됨' : '미확인'} />
          <InfoRow icon="child" label="자녀" value={
            currentUser.remarriageInfo.hasChildren
              ? `${currentUser.remarriageInfo.childrenCount}명 (양육권: ${currentUser.remarriageInfo.hasCustody ? '있음' : '없음'})`
              : '없음'
          } />
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={18} color={COLORS.error} />
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <FontAwesome name={icon as any} size={16} color={COLORS.textLight} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  profileHeader: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: SIZES.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  detail: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  remarriageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.remarriage,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  remarriageText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIcon: {
    width: 24,
  },
  infoLabel: {
    width: 60,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
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
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hobbyText: {
    color: COLORS.primaryDark,
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  introText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: SIZES.padding,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  logoutText: {
    fontSize: SIZES.md,
    color: COLORS.error,
    fontWeight: '600',
  },
});
