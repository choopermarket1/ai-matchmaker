import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';

export default function ChatListScreen() {
  const { chatRooms } = useStore();

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return '방금';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${Math.floor(diffHour / 24)}일 전`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {chatRooms.length === 0 ? (
          <View style={styles.empty}>
            <FontAwesome name="comments-o" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>채팅 내역이 없습니다</Text>
            <Text style={styles.emptyText}>
              매칭에서 좋아요를 보내면{'\n'}채팅이 시작됩니다
            </Text>
          </View>
        ) : (
          chatRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.chatRow}
              onPress={() => router.push(`/chatroom/${room.id}`)}
            >
              <Image source={{ uri: room.partnerImage }} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{room.partnerName}</Text>
                  <Text style={styles.chatTime}>
                    {formatTime(room.lastMessageTime)}
                  </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {room.lastMessage}
                </Text>
              </View>
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
    backgroundColor: COLORS.white,
  },
  list: {
    flexGrow: 1,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  chatTime: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
  },
  lastMessage: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
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
    textAlign: 'center',
  },
});
