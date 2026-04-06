export type Gender = 'male' | 'female';

export type MBTI =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type MatchType = 'general' | 'remarriage';

export type Education =
  | 'high_school'
  | 'associate'
  | 'bachelor'
  | 'master'
  | 'doctorate';

export type IncomeRange =
  | 'under_3000'    // 3천만원 미만
  | '3000_5000'     // 3천~5천만원
  | '5000_7000'     // 5천~7천만원
  | '7000_10000'    // 7천~1억원
  | 'over_10000';   // 1억원 이상

export type Region =
  | 'seoul' | 'gyeonggi' | 'incheon'
  | 'busan' | 'daegu' | 'daejeon'
  | 'gwangju' | 'ulsan' | 'sejong'
  | 'gangwon' | 'chungbuk' | 'chungnam'
  | 'jeonbuk' | 'jeonnam' | 'gyeongbuk'
  | 'gyeongnam' | 'jeju';

export type Hobby =
  | 'fitness' | 'yoga' | 'running' | 'hiking'
  | 'cooking' | 'baking' | 'wine'
  | 'reading' | 'movie' | 'music' | 'art'
  | 'travel' | 'camping' | 'photography'
  | 'gaming' | 'coding' | 'crafts'
  | 'pets' | 'volunteering' | 'dance';

export type DrinkingLevel = 'none' | 'sometimes' | 'often';
export type SmokingStatus = 'no' | 'yes' | 'quit';

// 직업군 분류
export type JobCategory =
  | 'it_tech'       // IT/기술
  | 'finance'       // 금융/회계
  | 'medical'       // 의료/보건
  | 'education'     // 교육
  | 'legal'         // 법률
  | 'creative'      // 예술/크리에이티브
  | 'business'      // 경영/사무
  | 'engineering'   // 공학/건축
  | 'public'        // 공무원/공공
  | 'service'       // 서비스/유통
  | 'media'         // 미디어/방송
  | 'self_employed' // 자영업
  | 'research'      // 연구/학술
  | 'other';

// 결혼 상태 (유부남/유부녀 필터링용)
export type MaritalStatus = 'single' | 'divorced' | 'widowed';

// 인증 상태
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

// 인증 시스템
export interface Verification {
  identity: VerificationStatus;      // 본인인증 (PASS/통신사)
  maritalStatus: VerificationStatus; // 미혼/이혼 확인 (가족관계증명서)
  job: VerificationStatus;           // 재직 확인 (건강보험 자격득실)
  education: VerificationStatus;     // 학력 확인 (학력인증 API)
  photo: VerificationStatus;         // 사진 인증 (AI 얼굴대조)
  income: VerificationStatus;        // 소득 확인 (원천징수영수증)
}

// 프로필 사진 (최소 3장)
export interface ProfilePhotos {
  main: string;           // 메인 프로필 사진
  face: string;           // 얼굴 클로즈업
  body: string;           // 반신/전신
  additional: string[];   // 추가 사진 (취미, 일상 등)
}

export interface SNSProfile {
  platform: 'instagram' | 'facebook' | 'threads';
  url: string;
}

export interface RemarriageInfo {
  divorceConfirmed: boolean;
  divorceAgreementSigned: boolean;
  hasChildren: boolean;
  childrenCount?: number;
  hasCustody?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  region: Region;
  mbti: MBTI;
  education: Education;
  jobCategory: JobCategory;
  job: string;
  income: IncomeRange;
  hobbies: Hobby[];
  introduction: string;
  drinking: DrinkingLevel;
  smoking: SmokingStatus;
  snsProfiles: SNSProfile[];
  matchType: MatchType;
  maritalStatus: MaritalStatus;
  verification: Verification;
  photos: ProfilePhotos;
  remarriageInfo?: RemarriageInfo;
  profileImage: string; // backward compat - points to photos.main
  createdAt: string;
}

export interface MatchResult {
  user: UserProfile;
  score: number;
  breakdown: {
    mbti: number;
    job: number;
    hobbies: number;
    region: number;
    education: number;
    income: number;
    age: number;
    lifestyle: number;
    verification: number;
    remarriage?: number;
    [key: string]: number | undefined;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerImage: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export const REGION_LABELS: Record<Region, string> = {
  seoul: '서울', gyeonggi: '경기', incheon: '인천',
  busan: '부산', daegu: '대구', daejeon: '대전',
  gwangju: '광주', ulsan: '울산', sejong: '세종',
  gangwon: '강원', chungbuk: '충북', chungnam: '충남',
  jeonbuk: '전북', jeonnam: '전남', gyeongbuk: '경북',
  gyeongnam: '경남', jeju: '제주',
};

export const EDUCATION_LABELS: Record<Education, string> = {
  high_school: '고등학교 졸업',
  associate: '전문대 졸업',
  bachelor: '대학교 졸업',
  master: '석사',
  doctorate: '박사',
};

export const INCOME_LABELS: Record<IncomeRange, string> = {
  under_3000: '3,000만원 미만',
  '3000_5000': '3,000~5,000만원',
  '5000_7000': '5,000~7,000만원',
  '7000_10000': '7,000만~1억원',
  over_10000: '1억원 이상',
};

export const HOBBY_LABELS: Record<Hobby, string> = {
  fitness: '헬스', yoga: '요가', running: '러닝', hiking: '등산',
  cooking: '요리', baking: '베이킹', wine: '와인',
  reading: '독서', movie: '영화', music: '음악', art: '미술',
  travel: '여행', camping: '캠핑', photography: '사진',
  gaming: '게임', coding: '코딩', crafts: '공예',
  pets: '반려동물', volunteering: '봉사활동', dance: '댄스',
};

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  it_tech: 'IT/기술', finance: '금융/회계', medical: '의료/보건',
  education: '교육', legal: '법률', creative: '예술/크리에이티브',
  business: '경영/사무', engineering: '공학/건축', public: '공무원/공공',
  service: '서비스/유통', media: '미디어/방송', self_employed: '자영업',
  research: '연구/학술', other: '기타',
};

export const VERIFICATION_LABELS: Record<string, string> = {
  identity: '본인인증',
  maritalStatus: '미혼확인',
  job: '재직인증',
  education: '학력인증',
  photo: '사진인증',
  income: '소득인증',
};

// 결혼 커플 통계 기반 직업군 궁합 데이터 (통계청 혼인통계 참고)
// 실제 데이터: 동일/유사 직업군 커플이 결혼 유지율이 높음
export const JOB_COMPATIBILITY: Record<string, JobCategory[]> = {
  it_tech: ['it_tech', 'creative', 'business', 'research'],
  finance: ['finance', 'legal', 'business', 'public'],
  medical: ['medical', 'research', 'education', 'public'],
  education: ['education', 'public', 'medical', 'research'],
  legal: ['legal', 'finance', 'public', 'business'],
  creative: ['creative', 'media', 'it_tech', 'self_employed'],
  business: ['business', 'finance', 'it_tech', 'legal'],
  engineering: ['engineering', 'it_tech', 'research', 'business'],
  public: ['public', 'education', 'legal', 'medical'],
  service: ['service', 'self_employed', 'creative', 'business'],
  media: ['media', 'creative', 'it_tech', 'business'],
  self_employed: ['self_employed', 'service', 'creative', 'business'],
  research: ['research', 'medical', 'engineering', 'education'],
  other: ['other', 'business', 'service', 'self_employed'],
};
