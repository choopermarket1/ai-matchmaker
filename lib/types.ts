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

// 반려동물 정보
export type PetType = 'dog' | 'cat' | 'both' | 'other' | 'none';
export type PetSize = 'small' | 'medium' | 'large';       // 소형/중형/대형
export type PetTemperament = 'calm' | 'active' | 'playful' | 'independent'; // 차분/활발/장난/독립

export interface PetInfo {
  hasPet: boolean;
  petType: PetType;
  petName?: string;
  breed?: string;
  petSize?: PetSize;
  petTemperament?: PetTemperament;
  petFriendly: boolean;
}

export const PET_TYPE_LABELS: Record<PetType, string> = {
  dog: '강아지', cat: '고양이', both: '강아지+고양이',
  other: '기타', none: '없음',
};

export const PET_SIZE_LABELS: Record<PetSize, string> = {
  small: '소형', medium: '중형', large: '대형',
};

export const PET_TEMPERAMENT_LABELS: Record<PetTemperament, string> = {
  calm: '차분한', active: '활발한', playful: '장난꾸러기', independent: '독립적인',
};

// 사주/생년월일 정보
export type CalendarType = 'solar' | 'lunar'; // 양력/음력

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  calendarType: CalendarType;
  birthHour?: number;        // 태어난 시 (0~23, 선택사항이지만 권고)
  zodiacAnimal?: string;     // 띠 (자동 계산)
  fiveElement?: string;      // 오행 (자동 계산)
}

// 띠 계산
export function getZodiacAnimal(year: number): string {
  const animals = ['원숭이','닭','개','돼지','쥐','소','호랑이','토끼','용','뱀','말','양'];
  return animals[year % 12];
}

// 오행 계산
export function getFiveElement(year: number): string {
  const elements = ['금','금','수','수','목','목','화','화','토','토'];
  return elements[year % 10];
}

// 사주 궁합표 (띠 기반)
export const ZODIAC_COMPATIBILITY: Record<string, string[]> = {
  '쥐': ['용', '원숭이', '소'],
  '소': ['뱀', '닭', '쥐'],
  '호랑이': ['말', '개', '돼지'],
  '토끼': ['양', '돼지', '개'],
  '용': ['쥐', '원숭이', '닭'],
  '뱀': ['소', '닭', '원숭이'],
  '말': ['호랑이', '양', '개'],
  '양': ['토끼', '말', '돼지'],
  '원숭이': ['쥐', '용', '뱀'],
  '닭': ['소', '뱀', '용'],
  '개': ['호랑이', '토끼', '말'],
  '돼지': ['토끼', '양', '호랑이'],
};

// 오행 상생/상극
export const FIVE_ELEMENT_COMPAT: Record<string, { good: string[]; bad: string[] }> = {
  '목': { good: ['수', '화'], bad: ['금'] },
  '화': { good: ['목', '토'], bad: ['수'] },
  '토': { good: ['화', '금'], bad: ['목'] },
  '금': { good: ['토', '수'], bad: ['화'] },
  '수': { good: ['금', '목'], bad: ['토'] },
};

// 국가별 종교/정치 설정
export type Country = 'KR' | 'US' | 'JP' | 'CN' | 'GB' | 'DE' | 'FR' | 'TH' | 'VN' | 'ID' | 'PH' | 'global';

export type Religion =
  | 'none' | 'christian' | 'catholic' | 'buddhist'
  | 'muslim' | 'hindu' | 'jewish' | 'shinto'
  | 'confucian' | 'other';

export type ReligionImportance = 'not_important' | 'somewhat' | 'important' | 'must_match';

// 나라별 종교 옵션 (해당 국가에서 흔한 종교만 표시)
export const RELIGION_BY_COUNTRY: Record<Country, Religion[]> = {
  KR: ['none', 'christian', 'catholic', 'buddhist', 'other'],
  US: ['none', 'christian', 'catholic', 'jewish', 'muslim', 'buddhist', 'hindu', 'other'],
  JP: ['none', 'buddhist', 'shinto', 'christian', 'other'],
  CN: ['none', 'buddhist', 'confucian', 'christian', 'muslim', 'other'],
  GB: ['none', 'christian', 'catholic', 'muslim', 'hindu', 'jewish', 'other'],
  DE: ['none', 'christian', 'catholic', 'muslim', 'jewish', 'other'],
  FR: ['none', 'catholic', 'muslim', 'christian', 'jewish', 'buddhist', 'other'],
  TH: ['buddhist', 'muslim', 'christian', 'none', 'other'],
  VN: ['none', 'buddhist', 'catholic', 'confucian', 'other'],
  ID: ['muslim', 'christian', 'catholic', 'hindu', 'buddhist', 'other'],
  PH: ['catholic', 'christian', 'muslim', 'none', 'other'],
  global: ['none', 'christian', 'catholic', 'buddhist', 'muslim', 'hindu', 'jewish', 'shinto', 'confucian', 'other'],
};

export const RELIGION_LABELS: Record<Religion, string> = {
  none: '무교', christian: '기독교(개신교)', catholic: '천주교',
  buddhist: '불교', muslim: '이슬람', hindu: '힌두교',
  jewish: '유대교', shinto: '신도', confucian: '유교', other: '기타',
};

export const RELIGION_LABELS_EN: Record<Religion, string> = {
  none: 'No religion', christian: 'Protestant', catholic: 'Catholic',
  buddhist: 'Buddhist', muslim: 'Muslim', hindu: 'Hindu',
  jewish: 'Jewish', shinto: 'Shinto', confucian: 'Confucian', other: 'Other',
};

// 정치 성향
export type PoliticalLeaning =
  | 'very_progressive' | 'progressive' | 'moderate'
  | 'conservative' | 'very_conservative' | 'no_interest';

export type PoliticalImportance = 'not_important' | 'somewhat' | 'important' | 'must_match';

// 나라별 정치 레이블 (각 나라의 정치 스펙트럼에 맞게)
export const POLITICAL_LABELS_BY_COUNTRY: Record<Country, Record<PoliticalLeaning, string>> = {
  KR: {
    very_progressive: '매우 진보', progressive: '진보', moderate: '중도',
    conservative: '보수', very_conservative: '매우 보수', no_interest: '관심없음',
  },
  US: {
    very_progressive: 'Very Liberal', progressive: 'Liberal', moderate: 'Moderate',
    conservative: 'Conservative', very_conservative: 'Very Conservative', no_interest: 'Not Political',
  },
  JP: {
    very_progressive: '革新的', progressive: 'リベラル', moderate: '中道',
    conservative: '保守', very_conservative: '右翼', no_interest: '関心なし',
  },
  CN: {
    very_progressive: '开放派', progressive: '改革派', moderate: '中间派',
    conservative: '保守派', very_conservative: '传统派', no_interest: '不关心',
  },
  GB: {
    very_progressive: 'Very Left', progressive: 'Left/Labour', moderate: 'Centre',
    conservative: 'Right/Tory', very_conservative: 'Far Right', no_interest: 'Not Political',
  },
  DE: {
    very_progressive: 'Sehr Links', progressive: 'Links/Grün', moderate: 'Mitte',
    conservative: 'Konservativ/CDU', very_conservative: 'Sehr Rechts', no_interest: 'Unpolitisch',
  },
  FR: {
    very_progressive: 'Très à gauche', progressive: 'Gauche', moderate: 'Centre',
    conservative: 'Droite', very_conservative: 'Extrême droite', no_interest: 'Apolitique',
  },
  TH: {
    very_progressive: 'ก้าวหน้ามาก', progressive: 'ก้าวหน้า', moderate: 'กลาง',
    conservative: 'อนุรักษ์', very_conservative: 'อนุรักษ์มาก', no_interest: 'ไม่สนใจ',
  },
  VN: {
    very_progressive: 'Rất cấp tiến', progressive: 'Cấp tiến', moderate: 'Trung lập',
    conservative: 'Bảo thủ', very_conservative: 'Rất bảo thủ', no_interest: 'Không quan tâm',
  },
  ID: {
    very_progressive: 'Sangat Progresif', progressive: 'Progresif', moderate: 'Moderat',
    conservative: 'Konservatif', very_conservative: 'Sangat Konservatif', no_interest: 'Tidak Peduli',
  },
  PH: {
    very_progressive: 'Very Liberal', progressive: 'Liberal', moderate: 'Moderate',
    conservative: 'Conservative', very_conservative: 'Very Conservative', no_interest: 'Not Political',
  },
  global: {
    very_progressive: 'Very Progressive', progressive: 'Progressive', moderate: 'Moderate',
    conservative: 'Conservative', very_conservative: 'Very Conservative', no_interest: 'Not Political',
  },
};

export const POLITICAL_LABELS = POLITICAL_LABELS_BY_COUNTRY.KR; // 기본 한국

export interface BeliefProfile {
  religion: Religion;
  religionImportance: ReligionImportance;
  political: PoliticalLeaning;
  politicalImportance: PoliticalImportance;
}

// 예술 취향 (음악/미술)
export type MusicGenre =
  | 'kpop' | 'pop' | 'hiphop' | 'rnb' | 'ballad' | 'indie'
  | 'rock' | 'jazz' | 'classical' | 'edm' | 'folk' | 'trot';

export type ArtStyle =
  | 'modern' | 'classical' | 'abstract' | 'photography'
  | 'illustration' | 'sculpture' | 'none';

export interface FavoriteSong {
  title: string;
  artist: string;
}

export interface ArtTaste {
  favoriteGenres: MusicGenre[];       // 좋아하는 음악 장르 (복수)
  top3Songs: FavoriteSong[];          // 가장 좋아하는 노래 베스트 3
  artStyle: ArtStyle;                 // 미술 취향
  concertFrequency: 'never' | 'rarely' | 'sometimes' | 'often'; // 공연/전시 관람 빈도
}

export const MUSIC_GENRE_LABELS: Record<MusicGenre, string> = {
  kpop: 'K-POP', pop: 'POP', hiphop: '힙합', rnb: 'R&B',
  ballad: '발라드', indie: '인디', rock: '록', jazz: '재즈',
  classical: '클래식', edm: 'EDM', folk: '포크', trot: '트로트',
};

export const ART_STYLE_LABELS: Record<ArtStyle, string> = {
  modern: '현대미술', classical: '고전미술', abstract: '추상화',
  photography: '사진예술', illustration: '일러스트', sculpture: '조각', none: '관심없음',
};

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
  pet: PetInfo;
  birthInfo: BirthInfo;
  faceImpression: string;
  photoVisibility: 'public' | 'match_only' | 'private';
  artTaste: ArtTaste;
  belief: BeliefProfile;
  hometown: string;       // 고향 (예: '서울', '부산', '제주')
  country: Country;       // 국가 (2차 해외확장용)
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
    pet: number;
    saju: number;
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

// 멤버십 등급
export type MembershipTier = 'free' | 'basic' | 'premium' | 'vip';

export const MEMBERSHIP_INFO: Record<MembershipTier, {
  name: string;
  price: string;
  color: string;
  features: string[];
  verification: string[];
}> = {
  free: {
    name: '무료 회원',
    price: '무료',
    color: '#B2BEC3',
    features: [
      '하루 5명 프로필 열람',
      '기본 매칭 점수 확인',
      '좋아요 하루 3회',
    ],
    verification: ['휴대폰 본인인증', '사진 인증'],
  },
  basic: {
    name: '베이직',
    price: '월 19,900원',
    color: '#4ECDC4',
    features: [
      '하루 20명 프로필 열람',
      '상세 매칭 점수 확인',
      '좋아요 하루 10회',
      'AI 이상형 매칭 하루 3회',
    ],
    verification: ['휴대폰 본인인증', '사진 인증', '미혼 확인'],
  },
  premium: {
    name: '프리미엄',
    price: '월 39,900원',
    color: '#FF6B6B',
    features: [
      '무제한 프로필 열람',
      '전체 매칭 분석 리포트',
      '무제한 좋아요',
      'AI 이상형 매칭 무제한',
      'AI 대화 코칭',
      '누가 나를 좋아했는지 확인',
    ],
    verification: ['휴대폰 본인인증', '사진 인증', '미혼 확인', '재직 인증', '학력 인증'],
  },
  vip: {
    name: 'VIP',
    price: '월 59,900원',
    color: '#A29BFE',
    features: [
      '프리미엄 전체 기능',
      '소득 인증 배지',
      '프로필 상단 노출',
      '전담 AI 매칭 컨설턴트',
      '재혼 전용 매칭풀 접근',
      '매칭 성공률 상세 분석',
    ],
    verification: ['6단계 전체 인증 완료', '소득 인증 포함'],
  },
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
