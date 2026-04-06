// ===== Instagram OAuth 연동 =====
// Instagram Basic Display API / Graph API 연동

export interface InstagramProfile {
  id: string;
  username: string;
  profilePicture: string;    // 대표 프로필 사진
  mediaCount: number;
  recentPhotos: InstagramPhoto[];
}

export interface InstagramPhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  timestamp: string;
}

// 사진 공개 범위 설정
export type PhotoVisibility = 'public' | 'match_only' | 'private';

export const PHOTO_VISIBILITY_LABELS: Record<PhotoVisibility, string> = {
  public: '전체 공개',
  match_only: '매칭 후 공개',
  private: '비공개',
};

export interface PhotoSettings {
  mainPhoto: PhotoVisibility;       // 대표 사진
  additionalPhotos: PhotoVisibility; // 추가 사진
  instagramPhotos: PhotoVisibility;  // 인스타 사진
  autoSetFromInstagram: boolean;     // 인스타 대표사진 자동 설정
}

export const DEFAULT_PHOTO_SETTINGS: PhotoSettings = {
  mainPhoto: 'public',
  additionalPhotos: 'match_only',
  instagramPhotos: 'match_only',
  autoSetFromInstagram: true,
};

// ===== Instagram OAuth Flow =====
// 실제 구현 시 Instagram Graph API 사용
// https://developers.facebook.com/docs/instagram-basic-display-api

const INSTAGRAM_APP_ID = 'YOUR_INSTAGRAM_APP_ID';
const REDIRECT_URI = 'https://ai-matchmaker-sandy.vercel.app/auth/instagram/callback';

export function getInstagramAuthUrl(): string {
  return `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;
}

// 인스타그램 프로필 사진을 대표 사진으로 설정
export function setProfileFromInstagram(
  instagramProfile: InstagramProfile,
  settings: PhotoSettings,
): { mainPhoto: string; additionalPhotos: string[] } {
  const result = {
    mainPhoto: '',
    additionalPhotos: [] as string[],
  };

  if (settings.autoSetFromInstagram) {
    // 자동 설정: 인스타 프로필 사진을 대표 사진으로
    result.mainPhoto = instagramProfile.profilePicture;
  }

  // 최근 사진 중 최대 5장을 추가 사진으로
  result.additionalPhotos = instagramProfile.recentPhotos
    .slice(0, 5)
    .map((p) => p.url);

  return result;
}

// ===== 데모용 인스타그램 프로필 =====
export function getMockInstagramProfile(username: string): InstagramProfile {
  return {
    id: `ig_${username}`,
    username,
    profilePicture: `https://ui-avatars.com/api/?name=${username}&size=200&background=E1306C&color=fff`,
    mediaCount: Math.floor(Math.random() * 200) + 30,
    recentPhotos: Array.from({ length: 6 }, (_, i) => ({
      id: `photo_${i}`,
      url: `https://ui-avatars.com/api/?name=${username}_${i}&size=300&background=${['FF6B6B','4ECDC4','45B7D1','96CEB4','FFEAA7','DDA0DD'][i]}&color=fff`,
      thumbnail: `https://ui-avatars.com/api/?name=${username}_${i}&size=150&background=${['FF6B6B','4ECDC4','45B7D1','96CEB4','FFEAA7','DDA0DD'][i]}&color=fff`,
      caption: ['일상', '여행', '맛집', '운동', '카페', '풍경'][i],
      timestamp: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    })),
  };
}
