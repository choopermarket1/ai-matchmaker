import {
  UserProfile,
  MatchResult,
  MBTI,
  Region,
  Education,
  IncomeRange,
  DrinkingLevel,
  SmokingStatus,
  JobCategory,
  JOB_COMPATIBILITY,
} from './types';

// ===== MBTI 궁합표 (0~1 점수) =====
const MBTI_COMPATIBILITY: Record<string, number> = {
  'ENFP-INFJ': 1.0, 'ENFP-INTJ': 0.95,
  'ENTP-INFJ': 0.95, 'ENTP-INTJ': 1.0,
  'ENFJ-INFP': 1.0, 'ENFJ-ISFP': 0.9,
  'ENTJ-INFP': 0.9, 'ENTJ-INTP': 1.0,
  'ESFP-ISTJ': 0.9, 'ESFP-ISFJ': 0.85,
  'ESTP-ISTJ': 0.85, 'ESTP-ISFJ': 0.9,
  'ESFJ-ISTP': 0.9, 'ESFJ-ISFP': 0.85,
  'ESTJ-ISTP': 0.85, 'ESTJ-INTP': 0.9,
  'ENFP-ENFJ': 0.8, 'ENFP-ENTP': 0.75,
  'INFJ-INFP': 0.8, 'INTJ-INTP': 0.8,
  'ENFJ-ENTJ': 0.75, 'INFP-ISFP': 0.7,
  'ESFP-ESTP': 0.7, 'ISFJ-ISTJ': 0.75,
  'ESFJ-ESTJ': 0.7, 'ISTP-ISFP': 0.7,
  'ENFP-ESFP': 0.6, 'INTJ-ISTJ': 0.55,
  'ENTP-ESTP': 0.6, 'INFJ-ISFJ': 0.55,
  'ENFJ-ESFJ': 0.6, 'INFP-INTP': 0.65,
  'ENTJ-ESTJ': 0.6, 'ISFP-ISFJ': 0.55,
};

function getMbtiScore(mbti1: MBTI, mbti2: MBTI): number {
  if (mbti1 === mbti2) return 0.7;
  const key1 = `${mbti1}-${mbti2}`;
  const key2 = `${mbti2}-${mbti1}`;
  return MBTI_COMPATIBILITY[key1] ?? MBTI_COMPATIBILITY[key2] ?? 0.5;
}

// ===== 직업군 궁합 (통계청 혼인통계 기반) =====
function getJobScore(j1: JobCategory, j2: JobCategory): number {
  if (j1 === j2) return 1.0; // 같은 직업군 최고 점수
  const compatible = JOB_COMPATIBILITY[j1] || [];
  const idx = compatible.indexOf(j2);
  if (idx === 0) return 1.0;
  if (idx === 1) return 0.85;
  if (idx === 2) return 0.7;
  if (idx === 3) return 0.55;
  return 0.4; // 호환 목록에 없는 직업군
}

// ===== 지역 근접도 =====
const REGION_GROUPS: Record<string, Region[]> = {
  capital: ['seoul', 'gyeonggi', 'incheon'],
  chungcheong: ['daejeon', 'sejong', 'chungbuk', 'chungnam'],
  gyeongsang: ['busan', 'daegu', 'ulsan', 'gyeongbuk', 'gyeongnam'],
  jeolla: ['gwangju', 'jeonbuk', 'jeonnam'],
  etc: ['gangwon', 'jeju'],
};

function getRegionGroup(region: Region): string {
  for (const [group, regions] of Object.entries(REGION_GROUPS)) {
    if (regions.includes(region)) return group;
  }
  return 'etc';
}

function getRegionScore(r1: Region, r2: Region): number {
  if (r1 === r2) return 1.0;
  if (getRegionGroup(r1) === getRegionGroup(r2)) return 0.7;
  return 0.3;
}

// ===== 취미 겹침 =====
function getHobbiesScore(h1: string[], h2: string[]): number {
  const set1 = new Set(h1);
  const common = h2.filter((h) => set1.has(h));
  if (Math.min(h1.length, h2.length) === 0) return 0;
  return common.length / Math.min(h1.length, h2.length);
}

// ===== 학력 유사도 =====
const EDUCATION_RANK: Record<Education, number> = {
  high_school: 1, associate: 2, bachelor: 3, master: 4, doctorate: 5,
};

function getEducationScore(e1: Education, e2: Education): number {
  const diff = Math.abs(EDUCATION_RANK[e1] - EDUCATION_RANK[e2]);
  return Math.max(0, 1 - diff * 0.25);
}

// ===== 소득 유사도 =====
const INCOME_RANK: Record<IncomeRange, number> = {
  under_3000: 1, '3000_5000': 2, '5000_7000': 3, '7000_10000': 4, over_10000: 5,
};

function getIncomeScore(i1: IncomeRange, i2: IncomeRange): number {
  const diff = Math.abs(INCOME_RANK[i1] - INCOME_RANK[i2]);
  return Math.max(0, 1 - diff * 0.25);
}

// ===== 나이 적합도 =====
function getAgeScore(age1: number, age2: number): number {
  const diff = Math.abs(age1 - age2);
  if (diff <= 2) return 1.0;
  if (diff <= 5) return 0.8;
  if (diff <= 8) return 0.6;
  if (diff <= 12) return 0.4;
  return 0.2;
}

// ===== 생활패턴 =====
function getLifestyleScore(
  d1: DrinkingLevel, d2: DrinkingLevel,
  s1: SmokingStatus, s2: SmokingStatus,
): number {
  const drinkMap: Record<DrinkingLevel, number> = { none: 0, sometimes: 1, often: 2 };
  const drinkDiff = Math.abs(drinkMap[d1] - drinkMap[d2]);
  const drinkScore = 1 - drinkDiff * 0.3;
  const smokeScore = s1 === s2 ? 1.0 : (s1 === 'quit' || s2 === 'quit') ? 0.7 : 0.3;
  return (drinkScore + smokeScore) / 2;
}

// ===== 재혼 호환성 (재혼 전용 추가 점수) =====
function getRemarriageScore(user: UserProfile, candidate: UserProfile): number {
  if (user.matchType !== 'remarriage') return 0;
  const u = user.remarriageInfo;
  const c = candidate.remarriageInfo;
  if (!u || !c) return 0;

  let score = 0.5; // 기본 점수

  // 자녀 상황 호환성
  if (u.hasChildren === c.hasChildren) score += 0.2; // 둘 다 자녀 있거나 없거나
  if (u.hasChildren && c.hasChildren) {
    // 양육권 상황 고려 - 둘 다 양육 중이면 이해도 높음
    if (u.hasCustody && c.hasCustody) score += 0.15;
    else if (u.hasCustody === c.hasCustody) score += 0.1;
  }

  // 나이 차이는 재혼에서 더 관대하게
  score += 0.15;

  return Math.min(score, 1.0);
}

// ===== 인증 보너스 (인증 많을수록 신뢰도 가산점) =====
function getVerificationBonus(candidate: UserProfile): number {
  const v = candidate.verification;
  let count = 0;
  if (v.identity === 'verified') count++;
  if (v.maritalStatus === 'verified') count++;
  if (v.job === 'verified') count++;
  if (v.education === 'verified') count++;
  if (v.photo === 'verified') count++;
  if (v.income === 'verified') count++;
  return count / 6; // 0~1
}

// ===== 가중치 (일반 매칭) =====
const WEIGHTS_GENERAL = {
  mbti: 0.20,
  job: 0.15,      // 직업군 궁합 NEW
  hobbies: 0.15,
  region: 0.12,
  education: 0.10,
  income: 0.08,
  age: 0.10,
  lifestyle: 0.05,
  verification: 0.05, // 인증 보너스 NEW
};

// ===== 가중치 (재혼 매칭) - 안정성/생활여건 비중 UP =====
const WEIGHTS_REMARRIAGE = {
  mbti: 0.12,
  job: 0.15,
  hobbies: 0.10,
  region: 0.12,
  education: 0.08,
  income: 0.10,
  age: 0.05,       // 재혼은 나이 비중 낮춤
  lifestyle: 0.08,
  verification: 0.05,
  remarriage: 0.15, // 재혼 호환성 NEW
};

export function calculateMatch(user: UserProfile, candidate: UserProfile): MatchResult {
  const mbti = getMbtiScore(user.mbti, candidate.mbti);
  const job = getJobScore(user.jobCategory, candidate.jobCategory);
  const hobbies = getHobbiesScore(user.hobbies, candidate.hobbies);
  const region = getRegionScore(user.region, candidate.region);
  const education = getEducationScore(user.education, candidate.education);
  const income = getIncomeScore(user.income, candidate.income);
  const age = getAgeScore(user.age, candidate.age);
  const lifestyle = getLifestyleScore(
    user.drinking, candidate.drinking,
    user.smoking, candidate.smoking,
  );
  const verification = getVerificationBonus(candidate);
  const remarriage = getRemarriageScore(user, candidate);

  const isRemarriage = user.matchType === 'remarriage';
  const w = isRemarriage ? WEIGHTS_REMARRIAGE : WEIGHTS_GENERAL;

  let totalScore: number;
  if (isRemarriage) {
    totalScore = (
      mbti * w.mbti +
      job * w.job +
      hobbies * w.hobbies +
      region * w.region +
      education * w.education +
      income * w.income +
      age * w.age +
      lifestyle * w.lifestyle +
      verification * w.verification +
      remarriage * w.remarriage
    );
  } else {
    totalScore = (
      mbti * (w as typeof WEIGHTS_GENERAL).mbti +
      job * (w as typeof WEIGHTS_GENERAL).job +
      hobbies * (w as typeof WEIGHTS_GENERAL).hobbies +
      region * (w as typeof WEIGHTS_GENERAL).region +
      education * (w as typeof WEIGHTS_GENERAL).education +
      income * (w as typeof WEIGHTS_GENERAL).income +
      age * (w as typeof WEIGHTS_GENERAL).age +
      lifestyle * (w as typeof WEIGHTS_GENERAL).lifestyle +
      verification * (w as typeof WEIGHTS_GENERAL).verification
    );
  }

  const score = Math.round(totalScore * 100);

  return {
    user: candidate,
    score,
    breakdown: {
      mbti: Math.round(mbti * 100),
      job: Math.round(job * 100),
      hobbies: Math.round(hobbies * 100),
      region: Math.round(region * 100),
      education: Math.round(education * 100),
      income: Math.round(income * 100),
      age: Math.round(age * 100),
      lifestyle: Math.round(lifestyle * 100),
      verification: Math.round(verification * 100),
      ...(isRemarriage ? { remarriage: Math.round(remarriage * 100) } : {}),
    },
  };
}

export function getMatches(
  user: UserProfile,
  candidates: UserProfile[],
  matchType?: 'general' | 'remarriage',
): MatchResult[] {
  const filtered = candidates.filter((c) => {
    if (c.id === user.id) return false;
    if (c.gender === user.gender) return false;
    if (matchType && c.matchType !== matchType) return false;

    // 싱글/이혼 필터: 유부남/유부녀 차단
    if (matchType === 'general' && c.maritalStatus !== 'single') return false;
    if (matchType === 'remarriage') {
      if (c.maritalStatus !== 'divorced' && c.maritalStatus !== 'widowed') return false;
      if (!c.remarriageInfo?.divorceConfirmed) return false;
      if (!c.remarriageInfo?.divorceAgreementSigned) return false;
    }

    // 본인인증 + 미혼확인 필수
    if (c.verification.identity !== 'verified') return false;
    if (c.verification.maritalStatus !== 'verified') return false;

    // 사진 인증 필수
    if (c.verification.photo !== 'verified') return false;

    return true;
  });

  return filtered
    .map((c) => calculateMatch(user, c))
    .sort((a, b) => b.score - a.score);
}
