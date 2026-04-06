import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { getAiMatches } from '@/lib/aiMatching';
import { REGION_LABELS, HOBBY_LABELS } from '@/lib/types';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'results';
  text: string;
  matches?: any[];
  summary?: string;
}

const AI_INTRO = `안녕하세요! AI 매칭 어시스턴트입니다 🤖💕

오늘 어떤 사람을 만나고 싶으세요?
자연스럽게 이상형을 말씀해주세요!

예시:
• "서울 사는 30대 초반 개발자"
• "활발하고 여행 좋아하는 사람"
• "ENFP이고 음악 취미인 사람"
• "차분하고 독서 좋아하는 교사"`;

export default function AiChatScreen() {
  const { currentUser } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'intro', type: 'ai', text: AI_INTRO },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!input.trim() || !currentUser) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input.trim();
    setInput('');

    // AI 매칭 실행
    setTimeout(() => {
      const { matches, parsed, summary } = getAiMatches(currentUser, query);

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        text: matches.length > 0
          ? `✨ ${summary}\n\n상위 ${matches.length}명의 매칭 결과를 보여드릴게요:`
          : '조건에 맞는 분을 찾지 못했어요. 다른 조건으로 다시 말씀해주세요!',
      };

      const resultMsg: Message = {
        id: `results_${Date.now()}`,
        type: 'results',
        text: '',
        matches,
        summary,
      };

      setMessages((prev) => [
        ...prev,
        aiMsg,
        ...(matches.length > 0 ? [resultMsg] : []),
      ]);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }, 800);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg) => {
          if (msg.type === 'results' && msg.matches) {
            return (
              <View key={msg.id} style={styles.resultsContainer}>
                {msg.matches.map((match: any, idx: number) => (
                  <TouchableOpacity
                    key={match.user.id}
                    style={styles.resultCard}
                    onPress={() => router.push(`/match/${match.user.id}`)}
                  >
                    <View style={styles.resultRank}>
                      <Text style={styles.rankText}>{idx + 1}</Text>
                    </View>
                    <Image
                      source={{ uri: match.user.profileImage }}
                      style={styles.resultAvatar}
                    />
                    <View style={styles.resultInfo}>
                      <View style={styles.resultNameRow}>
                        <Text style={styles.resultName}>{match.user.name}</Text>
                        <Text style={styles.resultAge}>{match.user.age}세</Text>
                      </View>
                      <Text style={styles.resultJob}>{match.user.job}</Text>
                      <Text style={styles.resultDetail}>
                        {match.user.mbti} • {REGION_LABELS[match.user.region]}
                      </Text>
                      {match.bonusFactors && match.bonusFactors.length > 0 && (
                        <View style={styles.bonusRow}>
                          <FontAwesome name="star" size={10} color={COLORS.accent} />
                          <Text style={styles.bonusText}>
                            {match.bonusFactors[0]}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.resultScore}>
                      <Text style={styles.scoreNumber}>{match.score}%</Text>
                      <Text style={styles.scoreLabel}>매칭</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }

          return (
            <View
              key={msg.id}
              style={[
                styles.msgRow,
                msg.type === 'user' ? styles.msgRowRight : styles.msgRowLeft,
              ]}
            >
              {msg.type === 'ai' && (
                <View style={styles.aiAvatar}>
                  <FontAwesome name="magic" size={14} color={COLORS.white} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.type === 'user' ? styles.bubbleUser : styles.bubbleAi,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.type === 'user' && styles.bubbleTextUser,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Quick Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {[
          '활발한 30대',
          '서울 개발자',
          '차분하고 독서파',
          'ENFP 여행러',
          '요리 좋아하는',
        ].map((chip) => (
          <TouchableOpacity
            key={chip}
            style={styles.chip}
            onPress={() => setInput(chip)}
          >
            <Text style={styles.chipText}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="오늘 만나고 싶은 이상형을 말해주세요..."
          placeholderTextColor={COLORS.textLight}
          multiline
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <FontAwesome name="magic" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  messages: { flex: 1 },
  messagesContent: { padding: SIZES.padding, gap: 10 },
  msgRow: { maxWidth: '85%' },
  msgRowRight: { alignSelf: 'flex-end' },
  msgRowLeft: { alignSelf: 'flex-start', flexDirection: 'row', gap: 8 },
  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginTop: 4,
  },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleAi: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, ...SHADOWS.small },
  bubbleText: { fontSize: SIZES.md, color: COLORS.text, lineHeight: 20 },
  bubbleTextUser: { color: COLORS.white },

  resultsContainer: { gap: 8, marginVertical: 4 },
  resultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 12, gap: 10, ...SHADOWS.small,
  },
  resultRank: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  rankText: { color: COLORS.white, fontSize: SIZES.sm, fontWeight: 'bold' },
  resultAvatar: { width: 48, height: 48, borderRadius: 24 },
  resultInfo: { flex: 1 },
  resultNameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  resultName: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.text },
  resultAge: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  resultJob: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 1 },
  resultDetail: { fontSize: SIZES.xs, color: COLORS.textLight, marginTop: 1 },
  bonusRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  bonusText: { fontSize: SIZES.xs, color: COLORS.primaryDark },
  resultScore: { alignItems: 'center' },
  scoreNumber: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.success },
  scoreLabel: { fontSize: SIZES.xs, color: COLORS.textLight },

  chipsScroll: { maxHeight: 44, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
  chips: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: {
    backgroundColor: COLORS.primary + '15', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  chipText: { fontSize: SIZES.sm, color: COLORS.primaryDark, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 8, paddingBottom: 12,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 8,
  },
  input: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: SIZES.md,
    maxHeight: 80, color: COLORS.text,
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: COLORS.textLight },
});
