import { create } from 'zustand';
import { UserProfile, MatchResult, ChatRoom, ChatMessage, MatchType, MembershipTier } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { getMatches } from '@/lib/matching';

// 멤버십별 제한
const LIMITS: Record<MembershipTier, {
  dailyLikes: number;
  dailyMessages: number;    // 하루 메시지 수
  canChat: boolean;          // 채팅 가능 여부
  canSeeWhoLiked: boolean;   // 누가 좋아했는지
  aiMatchPerDay: number;     // AI 이상형 매칭
}> = {
  free: { dailyLikes: 3, dailyMessages: 5, canChat: true, canSeeWhoLiked: false, aiMatchPerDay: 1 },
  basic: { dailyLikes: 10, dailyMessages: 30, canChat: true, canSeeWhoLiked: false, aiMatchPerDay: 3 },
  premium: { dailyLikes: 999, dailyMessages: 999, canChat: true, canSeeWhoLiked: true, aiMatchPerDay: 999 },
  vip: { dailyLikes: 999, dailyMessages: 999, canChat: true, canSeeWhoLiked: true, aiMatchPerDay: 999 },
};

interface AppState {
  // Auth
  isLoggedIn: boolean;
  currentUser: UserProfile | null;
  membership: MembershipTier;

  // Usage tracking
  todayLikes: number;
  todayMessages: number;
  todayAiMatches: number;

  // Matching
  matches: MatchResult[];
  likedUsers: string[];
  matchType: MatchType;

  // Chat
  chatRooms: ChatRoom[];

  // Actions
  login: (user: UserProfile) => void;
  logout: () => void;
  setMembership: (tier: MembershipTier) => void;
  setMatchType: (type: MatchType) => void;
  refreshMatches: () => void;
  likeUser: (userId: string) => { success: boolean; message?: string };
  unlikeUser: (userId: string) => void;
  sendMessage: (roomId: string, text: string) => { success: boolean; message?: string };
  startChat: (partnerId: string) => void;
  canSendMessage: () => boolean;
  getRemainingLikes: () => number;
  getRemainingMessages: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  membership: 'free',
  todayLikes: 0,
  todayMessages: 0,
  todayAiMatches: 0,
  matches: [],
  likedUsers: [],
  matchType: 'general',
  chatRooms: [],

  login: (user: UserProfile) => {
    set({ isLoggedIn: true, currentUser: user, todayLikes: 0, todayMessages: 0, todayAiMatches: 0 });
    setTimeout(() => get().refreshMatches(), 0);
  },

  logout: () => {
    set({
      isLoggedIn: false, currentUser: null,
      matches: [], likedUsers: [], chatRooms: [],
      todayLikes: 0, todayMessages: 0, todayAiMatches: 0,
    });
  },

  setMembership: (tier: MembershipTier) => {
    set({ membership: tier });
  },

  setMatchType: (type: MatchType) => {
    set({ matchType: type });
    get().refreshMatches();
  },

  refreshMatches: () => {
    const { currentUser, matchType } = get();
    if (!currentUser) return;
    const results = getMatches(currentUser, mockUsers, matchType);
    set({ matches: results });
  },

  getRemainingLikes: () => {
    const { membership, todayLikes } = get();
    const limit = LIMITS[membership].dailyLikes;
    return Math.max(0, limit - todayLikes);
  },

  getRemainingMessages: () => {
    const { membership, todayMessages } = get();
    const limit = LIMITS[membership].dailyMessages;
    return Math.max(0, limit - todayMessages);
  },

  canSendMessage: () => {
    const { membership, todayMessages } = get();
    return todayMessages < LIMITS[membership].dailyMessages;
  },

  likeUser: (userId: string) => {
    const { membership, todayLikes, likedUsers } = get();
    const limit = LIMITS[membership].dailyLikes;

    if (todayLikes >= limit) {
      return {
        success: false,
        message: `오늘 좋아요 ${limit}회를 모두 사용했습니다.\n${membership === 'free' ? '베이직 멤버십으로 업그레이드하면 하루 10회!' : '더 높은 멤버십으로 업그레이드해보세요.'}`,
      };
    }

    if (likedUsers.includes(userId)) {
      return { success: false, message: '이미 좋아요를 보낸 상대입니다.' };
    }

    set((state) => ({
      likedUsers: [...state.likedUsers, userId],
      todayLikes: state.todayLikes + 1,
    }));
    get().startChat(userId);
    return { success: true };
  },

  unlikeUser: (userId: string) => {
    set((state) => ({
      likedUsers: state.likedUsers.filter((id) => id !== userId),
    }));
  },

  startChat: (partnerId: string) => {
    const { chatRooms } = get();
    if (chatRooms.find((r) => r.partnerId === partnerId)) return;

    const partner = mockUsers.find((u) => u.id === partnerId);
    if (!partner) return;

    const newRoom: ChatRoom = {
      id: `chat_${Date.now()}`,
      partnerId,
      partnerName: partner.name,
      partnerImage: partner.profileImage,
      lastMessage: '매칭되었습니다! 대화를 시작해보세요 💕',
      lastMessageTime: new Date().toISOString(),
      messages: [
        {
          id: `msg_system_${Date.now()}`,
          senderId: 'system',
          text: '매칭되었습니다! 대화를 시작해보세요 💕',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    set((state) => ({
      chatRooms: [newRoom, ...state.chatRooms],
    }));
  },

  sendMessage: (roomId: string, text: string) => {
    const { currentUser, membership, todayMessages } = get();
    if (!currentUser || !text.trim()) return { success: false };

    const limit = LIMITS[membership].dailyMessages;
    if (todayMessages >= limit) {
      return {
        success: false,
        message: `오늘 메시지 ${limit}회를 모두 사용했습니다.\n${membership === 'free'
          ? '무료: 하루 5건 | 베이직: 30건 | 프리미엄: 무제한'
          : '프리미엄으로 업그레이드하면 무제한 메시지!'}`,
      };
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      todayMessages: state.todayMessages + 1,
      chatRooms: state.chatRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              messages: [...room.messages, newMsg],
              lastMessage: text.trim(),
              lastMessageTime: newMsg.timestamp,
            }
          : room
      ),
    }));

    // 상대방 자동 답장 시뮬레이션
    setTimeout(() => {
      const replies = [
        '안녕하세요! 반갑습니다 😊',
        '프로필 잘 봤어요! 취미가 비슷하네요',
        '혹시 이번 주말에 시간 되세요?',
        '저도 그거 좋아해요!',
        '맞아요, 완전 공감해요 ㅎㅎ',
        '오 좋아요! 더 얘기해봐요~',
        '혹시 좋아하는 카페 있으세요?',
        '프로필 보고 관심이 생겼어요!',
      ];
      const room = get().chatRooms.find((r) => r.id === roomId);
      if (!room) return;

      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId: room.partnerId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        chatRooms: state.chatRooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                messages: [...r.messages, replyMsg],
                lastMessage: replyMsg.text,
                lastMessageTime: replyMsg.timestamp,
              }
            : r
        ),
      }));
    }, 2000);

    return { success: true };
  },
}));
