import { create } from 'zustand';
import { UserProfile, MatchResult, ChatRoom, ChatMessage, MatchType } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { getMatches } from '@/lib/matching';

interface AppState {
  // Auth
  isLoggedIn: boolean;
  currentUser: UserProfile | null;

  // Matching
  matches: MatchResult[];
  likedUsers: string[];
  matchType: MatchType;

  // Chat
  chatRooms: ChatRoom[];

  // Actions
  login: (user: UserProfile) => void;
  logout: () => void;
  setMatchType: (type: MatchType) => void;
  refreshMatches: () => void;
  likeUser: (userId: string) => void;
  unlikeUser: (userId: string) => void;
  sendMessage: (roomId: string, text: string) => void;
  startChat: (partnerId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  matches: [],
  likedUsers: [],
  matchType: 'general',
  chatRooms: [],

  login: (user: UserProfile) => {
    set({ isLoggedIn: true, currentUser: user });
    // Auto refresh matches after login
    setTimeout(() => get().refreshMatches(), 0);
  },

  logout: () => {
    set({
      isLoggedIn: false,
      currentUser: null,
      matches: [],
      likedUsers: [],
      chatRooms: [],
    });
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

  likeUser: (userId: string) => {
    set((state) => ({
      likedUsers: [...state.likedUsers, userId],
    }));
    // Auto start chat when liked
    get().startChat(userId);
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
    const { currentUser } = get();
    if (!currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
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

    // Simulate partner reply after 2 seconds
    setTimeout(() => {
      const replies = [
        '안녕하세요! 반갑습니다 😊',
        '프로필 잘 봤어요! 취미가 비슷하네요',
        '혹시 이번 주말에 시간 되세요?',
        '저도 그거 좋아해요!',
        '맞아요, 완전 공감해요 ㅎㅎ',
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
  },
}));
