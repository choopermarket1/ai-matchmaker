import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MatchResult, REGION_LABELS, HOBBY_LABELS, JOB_CATEGORY_LABELS } from '@/lib/types';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import VerificationBadges from './VerificationBadges';

interface Props {
  match: MatchResult;
  onPress: () => void;
  onLike: () => void;
  isLiked: boolean;
}

export default function ProfileCard({ match, onPress, onLike, isLiked }: Props) {
  const { user, score } = match;

  const getScoreColor = (s: number) => {
    if (s >= 80) return COLORS.success;
    if (s >= 60) return COLORS.secondary;
    if (s >= 40) return COLORS.warning;
    return COLORS.textLight;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: user.profileImage }} style={styles.image} />
        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(score) }]}>
          <Text style={styles.scoreText}>{score}%</Text>
        </View>
        {user.matchType === 'remarriage' && (
          <View style={styles.remarriageBadge}>
            <Text style={styles.remarriageText}>재혼</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age}세</Text>
        </View>
        <Text style={styles.job}>
          {JOB_CATEGORY_LABELS[user.jobCategory]} • {user.job}
        </Text>
        <VerificationBadges verification={user.verification} compact />
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{user.mbti}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{REGION_LABELS[user.region]}</Text>
          </View>
        </View>
        <View style={styles.hobbies}>
          {user.hobbies.slice(0, 3).map((h) => (
            <View key={h} style={styles.hobbyTag}>
              <Text style={styles.hobbyText}>{HOBBY_LABELS[h]}</Text>
            </View>
          ))}
          {user.hobbies.length > 3 && (
            <Text style={styles.moreHobbies}>+{user.hobbies.length - 3}</Text>
          )}
        </View>
        <Text style={styles.intro} numberOfLines={2}>
          {user.introduction}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.likeButton, isLiked && styles.likedButton]}
        onPress={(e) => { e.stopPropagation(); onLike(); }}
      >
        <FontAwesome
          name={isLiked ? 'heart' : 'heart-o'}
          size={24}
          color={isLiked ? COLORS.white : COLORS.heart}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface,
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.md,
  },
  remarriageBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.remarriage,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remarriageText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  info: {
    padding: SIZES.padding,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  name: {
    fontSize: SIZES.xl,
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
    marginTop: 8,
  },
  tag: {
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: COLORS.primaryDark,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  hobbies: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  hobbyTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  hobbyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  moreHobbies: {
    color: COLORS.textLight,
    fontSize: SIZES.xs,
  },
  intro: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.heart + '30',
  },
  likedButton: {
    backgroundColor: COLORS.heart,
    borderColor: COLORS.heart,
  },
});
