import { UserProfile, MatchResult, MBTI, Region, Hobby, JobCategory, REGION_LABELS, HOBBY_LABELS, JOB_CATEGORY_LABELS } from './types';
import { mockUsers } from './mockData';
import { calculateMatch } from './matching';

// === AI 이상형 자연어 파싱 ===

interface ParsedIdeal {
  ageRange?: [number, number];
  gender?: 'male' | 'female';
  region?: Region[];
  mbti?: MBTI[];
  hobbies?: Hobby[];
  jobCategory?: JobCategory[];
  keywords: string[];
}

const MBTI_LIST: MBTI[] = [
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
];

const REGION_KEYWORDS: Record<string, Region> = {
  '서울': 'seoul', '경기': 'gyeonggi', '인천': 'incheon',
  '부산': 'busan', '대구': 'daegu', '대전': 'daejeon',
  '광주': 'gwangju', '울산': 'ulsan', '세종': 'sejong',
  '강원': 'gangwon', '충북': 'chungbuk', '충남': 'chungnam',
  '전북': 'jeonbuk', '전남': 'jeonnam', '경북': 'gyeongbuk',
  '경남': 'gyeongnam', '제주': 'jeju',
  '수도권': 'seoul',
};

const HOBBY_KEYWORDS: Record<string, Hobby> = {
  '운동': 'fitness', '헬스': 'fitness', '요가': 'yoga', '러닝': 'running',
  '등산': 'hiking', '산': 'hiking', '요리': 'cooking', '베이킹': 'baking',
  '와인': 'wine', '독서': 'reading', '책': 'reading', '영화': 'movie',
  '음악': 'music', '미술': 'art', '그림': 'art', '여행': 'travel',
  '캠핑': 'camping', '사진': 'photography', '카메라': 'photography',
  '게임': 'gaming', '코딩': 'coding', '개발': 'coding', '프로그래밍': 'coding',
  '공예': 'crafts', '반려동물': 'pets', '강아지': 'pets', '고양이': 'pets',
  '봉사': 'volunteering', '댄스': 'dance', '춤': 'dance',
};

const JOB_KEYWORDS: Record<string, JobCategory> = {
  'IT': 'it_tech', '개발': 'it_tech', '프로그래머': 'it_tech', '엔지니어': 'it_tech',
  '금융': 'finance', '회계': 'finance', '은행': 'finance',
  '의사': 'medical', '간호사': 'medical', '약사': 'medical', '의료': 'medical',
  '선생님': 'education', '교사': 'education', '교수': 'education', '강사': 'education',
  '변호사': 'legal', '법': 'legal', '판사': 'legal',
  '디자이너': 'creative', '예술': 'creative', '작가': 'creative', '크리에이터': 'creative',
  '사업': 'business', '경영': 'business', '마케팅': 'business',
  '건축': 'engineering', '공학': 'engineering',
  '공무원': 'public', '군인': 'public',
  '요리사': 'service', '셰프': 'service', '서비스': 'service',
  '방송': 'media', 'PD': 'media', '기자': 'media', '영상': 'media',
  '자영업': 'self_employed', '카페': 'self_employed', '창업': 'self_employed',
  '연구': 'research', '박사': 'research', '연구원': 'research',
};

const PERSONALITY_KEYWORDS: Record<string, MBTI[]> = {
  '활발': ['ENFP', 'ESFP', 'ENTP', 'ESTP'],
  '밝은': ['ENFP', 'ESFP', 'ENFJ', 'ESFJ'],
  '조용': ['INFJ', 'INFP', 'INTJ', 'INTP'],
  '차분': ['ISFJ', 'ISTJ', 'INFJ', 'INTJ'],
  '다정': ['ENFJ', 'ESFJ', 'ISFJ', 'INFJ'],
  '따뜻': ['ENFJ', 'ESFJ', 'ISFJ', 'INFP'],
  '유머': ['ENTP', 'ENFP', 'ESTP', 'ESFP'],
  '재미': ['ENTP', 'ENFP', 'ESTP', 'ESFP'],
  '지적': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  '똑똑': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  '리더': ['ENTJ', 'ESTJ', 'ENFJ'],
  '창의': ['ENFP', 'INFP', 'ENTP', 'INTP'],
  '감성': ['INFP', 'ISFP', 'ENFP', 'INFJ'],
  '로맨틱': ['INFP', 'ENFP', 'INFJ', 'ENFJ'],
  '성실': ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  '안정': ['ISTJ', 'ISFJ', 'ESTJ'],
};

export function parseIdealType(text: string): ParsedIdeal {
  const result: ParsedIdeal = { keywords: [] };

  // 나이 파싱
  const ageMatch = text.match(/(\d{2})\s*[~\-세살대]\s*(\d{2})?/);
  if (ageMatch) {
    const age1 = parseInt(ageMatch[1]);
    const age2 = ageMatch[2] ? parseInt(ageMatch[2]) : age1 + 5;
    result.ageRange = [Math.min(age1, age2), Math.max(age1, age2)];
  }
  // "20대", "30대" 등
  const decadeMatch = text.match(/(\d)0대/);
  if (decadeMatch && !result.ageRange) {
    const decade = parseInt(decadeMatch[1]) * 10;
    result.ageRange = [decade, decade + 9];
  }

  // 지역 파싱
  const regions: Region[] = [];
  for (const [keyword, region] of Object.entries(REGION_KEYWORDS)) {
    if (text.includes(keyword)) {
      if (keyword === '수도권') {
        regions.push('seoul', 'gyeonggi', 'incheon');
      } else {
        regions.push(region);
      }
    }
  }
  if (regions.length > 0) result.region = [...new Set(regions)];

  // MBTI 파싱
  const mbtiSet: Set<MBTI> = new Set();
  for (const mbti of MBTI_LIST) {
    if (text.toUpperCase().includes(mbti)) mbtiSet.add(mbti);
  }
  // 성격 키워드로 MBTI 추론
  for (const [keyword, types] of Object.entries(PERSONALITY_KEYWORDS)) {
    if (text.includes(keyword)) {
      types.forEach((t) => mbtiSet.add(t));
    }
  }
  if (mbtiSet.size > 0) result.mbti = Array.from(mbtiSet);

  // 취미 파싱
  const hobbies: Set<Hobby> = new Set();
  for (const [keyword, hobby] of Object.entries(HOBBY_KEYWORDS)) {
    if (text.includes(keyword)) hobbies.add(hobby);
  }
  if (hobbies.size > 0) result.hobbies = Array.from(hobbies);

  // 직업군 파싱
  const jobs: Set<JobCategory> = new Set();
  for (const [keyword, category] of Object.entries(JOB_KEYWORDS)) {
    if (text.includes(keyword)) jobs.add(category);
  }
  if (jobs.size > 0) result.jobCategory = Array.from(jobs);

  return result;
}

// 이상형 기반 매칭 점수 보정
export function getAiMatches(
  currentUser: UserProfile,
  idealText: string,
): { matches: MatchResult[]; parsed: ParsedIdeal; summary: string } {
  const parsed = parseIdealType(idealText);
  const candidates = mockUsers.filter((c) => {
    if (c.id === currentUser.id) return false;
    if (c.gender === currentUser.gender) return false;
    if (c.verification.identity !== 'verified') return false;
    if (c.verification.maritalStatus !== 'verified') return false;
    return true;
  });

  // 기본 매칭 점수 + 이상형 보정 점수
  const scored = candidates.map((c) => {
    const baseMatch = calculateMatch(currentUser, c);
    let bonus = 0;
    let bonusFactors: string[] = [];

    // 나이 보정
    if (parsed.ageRange) {
      if (c.age >= parsed.ageRange[0] && c.age <= parsed.ageRange[1]) {
        bonus += 15;
        bonusFactors.push(`나이 ${c.age}세 (희망 범위)`);
      }
    }

    // 지역 보정
    if (parsed.region && parsed.region.includes(c.region)) {
      bonus += 10;
      bonusFactors.push(`${REGION_LABELS[c.region]} 거주`);
    }

    // MBTI 보정
    if (parsed.mbti && parsed.mbti.includes(c.mbti)) {
      bonus += 12;
      bonusFactors.push(`${c.mbti} 성격`);
    }

    // 취미 보정
    if (parsed.hobbies) {
      const commonHobbies = parsed.hobbies.filter((h) => c.hobbies.includes(h));
      if (commonHobbies.length > 0) {
        bonus += commonHobbies.length * 5;
        bonusFactors.push(`공통 취미: ${commonHobbies.map((h) => HOBBY_LABELS[h]).join(', ')}`);
      }
    }

    // 직업 보정
    if (parsed.jobCategory && parsed.jobCategory.includes(c.jobCategory)) {
      bonus += 10;
      bonusFactors.push(`${JOB_CATEGORY_LABELS[c.jobCategory]} 직종`);
    }

    const finalScore = Math.min(99, baseMatch.score + bonus);

    return {
      ...baseMatch,
      score: finalScore,
      bonusFactors,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // 요약 생성
  const parts: string[] = [];
  if (parsed.ageRange) parts.push(`${parsed.ageRange[0]}~${parsed.ageRange[1]}세`);
  if (parsed.region) parts.push(parsed.region.map((r) => REGION_LABELS[r]).join('/'));
  if (parsed.mbti) parts.push(parsed.mbti.slice(0, 3).join('/'));
  if (parsed.hobbies) parts.push(parsed.hobbies.map((h) => HOBBY_LABELS[h]).join('/'));
  if (parsed.jobCategory) parts.push(parsed.jobCategory.map((j) => JOB_CATEGORY_LABELS[j]).join('/'));

  const summary = parts.length > 0
    ? `"${parts.join(', ')}" 조건으로 ${scored.length}명 중 최적 매칭을 찾았습니다.`
    : `전체 ${scored.length}명 중 호환성 높은 순으로 추천합니다.`;

  return {
    matches: scored.slice(0, 5),
    parsed,
    summary,
  };
}

// === AI 대화 코칭 (첫 메시지 제안) ===

export function getConversationStarters(partner: UserProfile, currentUser: UserProfile): string[] {
  const starters: string[] = [];

  // 공통 취미 기반
  const commonHobbies = currentUser.hobbies.filter((h) => partner.hobbies.includes(h));
  if (commonHobbies.length > 0) {
    const hobby = HOBBY_LABELS[commonHobbies[0]];
    starters.push(`저도 ${hobby} 좋아하는데, 혹시 자주 하시나요?`);
    if (commonHobbies.length > 1) {
      const hobby2 = HOBBY_LABELS[commonHobbies[1]];
      starters.push(`${hobby}도 좋아하시고 ${hobby2}도 좋아하시는군요! 취미가 정말 비슷하네요 😊`);
    }
  }

  // MBTI 기반
  const mbtiPair = `${currentUser.mbti}-${partner.mbti}`;
  starters.push(`${partner.mbti}시군요! ${currentUser.mbti}인 저와 궁합이 잘 맞는다고 하더라고요 ㅎㅎ`);

  // 직업 기반
  starters.push(`${partner.job}이시라니 멋지네요! 어떻게 시작하게 되셨어요?`);

  // 지역 기반
  if (currentUser.region === partner.region) {
    starters.push(`같은 ${REGION_LABELS[partner.region]}에 사시네요! 혹시 좋아하는 맛집이나 카페 있으세요?`);
  }

  // 자기소개 기반
  if (partner.introduction.length > 20) {
    starters.push(`프로필 소개 읽었는데, "${partner.introduction.slice(0, 15)}..." 부분이 인상적이었어요!`);
  }

  // 일반적인 좋은 오프너
  starters.push(`안녕하세요! 프로필 보고 관심이 생겨서 인사드려요. 요즘 주말에 뭐 하세요?`);
  starters.push(`프로필이 진솔해서 좋았어요. 혹시 요즘 빠져 있는 거 있으세요?`);

  return starters.slice(0, 5);
}

// === 매칭 성공률 통계 (시뮬레이션) ===

export interface MatchStats {
  totalMatches: number;
  threeMonthRate: number;    // 3개월 이상 만남 비율
  sixMonthRate: number;      // 6개월 이상 만남 비율
  marriageRate: number;      // 결혼/약혼 비율
  avgMatchScore: number;     // 평균 매칭 점수
  topFactors: string[];      // 성공 커플 공통 요인
  scoreRangeStats: {
    range: string;
    successRate: number;
  }[];
}

export function getMatchStats(): MatchStats {
  return {
    totalMatches: 12847,
    threeMonthRate: 67.3,
    sixMonthRate: 42.1,
    marriageRate: 8.7,
    avgMatchScore: 74,
    topFactors: [
      'MBTI 궁합 점수 80점 이상',
      '공통 취미 3개 이상',
      '같은 생활권 (지역 점수 70+)',
      '직업군 궁합 상위 20%',
      '생활패턴 유사 (음주/흡연 일치)',
    ],
    scoreRangeStats: [
      { range: '90~100점', successRate: 89.2 },
      { range: '80~89점', successRate: 73.5 },
      { range: '70~79점', successRate: 58.1 },
      { range: '60~69점', successRate: 41.3 },
      { range: '50~59점', successRate: 24.7 },
      { range: '50점 미만', successRate: 12.4 },
    ],
  };
}
