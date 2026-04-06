import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { mockUsers } from '@/lib/mockData';
import { REGION_LABELS } from '@/lib/types';

export default function MatchesScreen() {
  const { likedUsers } = useStore();

  const likedProfiles = likedUsers
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          좋아요 보낸 상대 <Text style={styles.count}>{likedProfiles.length}명</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {likedProfiles.length === 0 ? (
          <View style={styles.empty}>
            <FontAwesome name="heart-o" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>아직 좋아요를 보낸 상대가 없어요</Text>
            <Text style={styles.emptyText}>매칭 탭에서 마음에 드는 상대를 찾아보세요</Text>
          </View>
        ) : (
          likedProfiles.map((user) => user && (
            <TouchableOpacity
              key={user.id}
              style={styles.card}
              onPress={() => router.push(`/match/${user.id}`)}
            >
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.detail}>
                  {user.age}세 • {REGION_LABELS[user.region]} • {user.mbti}
                </Text>
                <Text style={styles.job}>{user.job}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const chatRoom = useStore.getState().chatRooms.find(
                    (r) => r.partnerId === user.id
                  );
                  if (chatRoom) {
                    router.push(`/chatroom/${chatRoom.id}`);
                  }
                }}
              >
                <FontAwesome name="comment" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
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
  header: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerText: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
  count: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  list: {
    padding: SIZES.padding,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 14,
    gap: 12,
    ...SHADOWS.small,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  detail: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  job: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
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
