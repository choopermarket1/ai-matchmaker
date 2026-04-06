import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { mockUsers } from '@/lib/mockData';
import { getConversationStarters } from '@/lib/aiMatching';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chatRooms, currentUser, sendMessage } = useStore();
  const [text, setText] = useState('');
  const [showCoaching, setShowCoaching] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const room = chatRooms.find((r) => r.id === id);
  const partner = room ? mockUsers.find((u) => u.id === room.partnerId) : null;
  const starters = (partner && currentUser) ? getConversationStarters(partner, currentUser) : [];

  if (!room || !currentUser) {
    return (
      <View style={styles.center}>
        <Text>채팅방을 찾을 수 없습니다</Text>
      </View>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(room.id, text);
    setText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {room.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.senderId === 'system';

          if (isSystem) {
            return (
              <View key={msg.id} style={styles.systemMsg}>
                <Text style={styles.systemMsgText}>{msg.text}</Text>
              </View>
            );
          }

          return (
            <View
              key={msg.id}
              style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}
            >
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                  {msg.text}
                </Text>
              </View>
              <Text style={styles.timeText}>{formatTime(msg.timestamp)}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* AI Coaching Panel */}
      {showCoaching && starters.length > 0 && (
        <View style={styles.coachingPanel}>
          <View style={styles.coachingHeader}>
            <FontAwesome name="magic" size={14} color={COLORS.primary} />
            <Text style={styles.coachingTitle}>AI 대화 코칭</Text>
            <TouchableOpacity onPress={() => setShowCoaching(false)}>
              <FontAwesome name="times" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.coachingDesc}>이 메시지로 대화를 시작해보세요:</Text>
          {starters.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.starterButton}
              onPress={() => { setText(s); setShowCoaching(false); }}
            >
              <Text style={styles.starterText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.coachButton}
          onPress={() => setShowCoaching(!showCoaching)}
        >
          <FontAwesome
            name="magic"
            size={18}
            color={showCoaching ? COLORS.primary : COLORS.textLight}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor={COLORS.textLight}
          multiline
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <FontAwesome name="send" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: SIZES.padding,
    gap: 8,
  },
  systemMsg: {
    alignSelf: 'center',
    backgroundColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 8,
  },
  systemMsgText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  msgRow: {
    maxWidth: '80%',
  },
  msgRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  msgRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: COLORS.white,
  },
  timeText: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
    marginHorizontal: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: SIZES.md,
    maxHeight: 100,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  coachButton: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  coachingPanel: {
    backgroundColor: COLORS.white, padding: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  coachingHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6,
  },
  coachingTitle: {
    flex: 1, fontSize: SIZES.md, fontWeight: '600', color: COLORS.primary,
  },
  coachingDesc: {
    fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 8,
  },
  starterButton: {
    backgroundColor: COLORS.primary + '10', padding: 10,
    borderRadius: SIZES.radius, marginBottom: 6,
    borderWidth: 1, borderColor: COLORS.primary + '20',
  },
  starterText: {
    fontSize: SIZES.md, color: COLORS.text, lineHeight: 18,
  },
});
