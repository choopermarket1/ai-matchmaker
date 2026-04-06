// ===== 관상 (Face Reading / 인상학) 기반 매칭 =====
// 한국 전통 관상학 + 현대 인상 심리학 기반 매칭

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'long' | 'diamond';
export type EyeType = 'big_round' | 'small' | 'almond' | 'crescent' | 'sharp' | 'droopy';
export type NoseType = 'high_straight' | 'small' | 'flat' | 'pointed' | 'round_tip' | 'aquiline';
export type LipType = 'full' | 'thin' | 'heart' | 'wide' | 'small' | 'balanced';
export type EarType = 'big_lobe' | 'small_lobe' | 'pointed' | 'round' | 'attached';
export type ForeheadType = 'wide' | 'narrow' | 'rounded' | 'flat' | 'high';
export type JawType = 'sharp' | 'round' | 'square' | 'pointed' | 'wide';

export interface FaceProfile {
  faceShape: FaceShape;
  eyeType: EyeType;
  noseType: NoseType;
  lipType: LipType;
  earType?: EarType;
  foreheadType?: ForeheadType;
  jawType?: JawType;
  overallImpression: FaceImpression;
}

// 인상 종합 분석
export type FaceImpression =
  | 'warm_gentle'      // 따뜻하고 부드러운 인상
  | 'sharp_charisma'   // 날카롭고 카리스마
  | 'cute_youthful'    // 귀엽고 동안
  | 'elegant_noble'    // 우아하고 고급스러운
  | 'friendly_approachable' // 친근하고 편안한
  | 'strong_reliable'  // 강인하고 믿음직한
  | 'mysterious_deep'  // 신비롭고 깊은
  | 'bright_cheerful'; // 밝고 화사한

export const FACE_SHAPE_LABELS: Record<FaceShape, string> = {
  oval: '계란형', round: '둥근형', square: '각진형',
  heart: '하트형', long: '긴형', diamond: '다이아몬드형',
};

export const EYE_TYPE_LABELS: Record<EyeType, string> = {
  big_round: '큰 눈', small: '작은 눈', almond: '아몬드형',
  crescent: '초승달 눈', sharp: '날카로운 눈', droopy: '처진 눈',
};

export const NOSE_TYPE_LABELS: Record<NoseType, string> = {
  high_straight: '높은 콧대', small: '작은 코', flat: '낮은 코',
  pointed: '뾰족한 코', round_tip: '둥근 코끝', aquiline: '매부리코',
};

export const LIP_TYPE_LABELS: Record<LipType, string> = {
  full: '두꺼운 입술', thin: '얇은 입술', heart: '하트 입술',
  wide: '넓은 입술', small: '작은 입술', balanced: '균형잡힌 입술',
};

export const IMPRESSION_LABELS: Record<FaceImpression, string> = {
  warm_gentle: '따뜻하고 부드러운',
  sharp_charisma: '카리스마 있는',
  cute_youthful: '귀엽고 동안',
  elegant_noble: '우아하고 고급스러운',
  friendly_approachable: '친근하고 편안한',
  strong_reliable: '강인하고 믿음직한',
  mysterious_deep: '신비롭고 깊은',
  bright_cheerful: '밝고 화사한',
};

// ===== 관상 궁합표 (인상 기반) =====
// 한국 관상학 "음양 조화" 원리: 상반된 인상이 서로 보완
const IMPRESSION_COMPATIBILITY: Record<FaceImpression, FaceImpression[]> = {
  warm_gentle: ['sharp_charisma', 'strong_reliable', 'bright_cheerful'],
  sharp_charisma: ['warm_gentle', 'cute_youthful', 'friendly_approachable'],
  cute_youthful: ['strong_reliable', 'sharp_charisma', 'elegant_noble'],
  elegant_noble: ['friendly_approachable', 'bright_cheerful', 'warm_gentle'],
  friendly_approachable: ['elegant_noble', 'sharp_charisma', 'mysterious_deep'],
  strong_reliable: ['cute_youthful', 'warm_gentle', 'bright_cheerful'],
  mysterious_deep: ['bright_cheerful', 'friendly_approachable', 'cute_youthful'],
  bright_cheerful: ['mysterious_deep', 'warm_gentle', 'elegant_noble'],
};

// ===== 얼굴형 궁합 (관상학 기반) =====
const FACE_SHAPE_COMPAT: Record<FaceShape, FaceShape[]> = {
  oval: ['oval', 'heart', 'diamond'],       // 계란형: 대부분과 잘 맞음
  round: ['square', 'long', 'diamond'],      // 둥근형: 각진/긴 형과 보완
  square: ['round', 'heart', 'oval'],        // 각진형: 부드러운 형과 조화
  heart: ['square', 'oval', 'round'],        // 하트형: 안정적인 형과 조화
  long: ['round', 'heart', 'diamond'],       // 긴형: 둥근/하트형과 보완
  diamond: ['oval', 'round', 'long'],        // 다이아몬드: 부드러운 형과 조화
};

// ===== 관상 궁합 점수 계산 =====
export function getFaceReadingScore(f1: FaceProfile, f2: FaceProfile): number {
  let score = 0;

  // 인상 궁합 (가장 중요: 50%)
  const goodImpressions = IMPRESSION_COMPATIBILITY[f1.overallImpression] || [];
  if (goodImpressions[0] === f2.overallImpression) score += 50;      // 최고 궁합
  else if (goodImpressions[1] === f2.overallImpression) score += 40;  // 좋은 궁합
  else if (goodImpressions[2] === f2.overallImpression) score += 35;  // 괜찮은 궁합
  else if (f1.overallImpression === f2.overallImpression) score += 30; // 같은 인상
  else score += 20; // 보통

  // 얼굴형 궁합 (30%)
  const goodShapes = FACE_SHAPE_COMPAT[f1.faceShape] || [];
  if (goodShapes.includes(f2.faceShape)) score += 30;
  else score += 15;

  // 눈 + 입 조합 보너스 (20%)
  // 큰 눈 + 작은 눈 = 보완 궁합
  const eyeCompat: Record<string, string[]> = {
    big_round: ['almond', 'crescent', 'small'],
    small: ['big_round', 'crescent', 'almond'],
    almond: ['big_round', 'droopy', 'sharp'],
    crescent: ['big_round', 'small', 'sharp'],
    sharp: ['crescent', 'almond', 'droopy'],
    droopy: ['sharp', 'almond', 'big_round'],
  };
  if (eyeCompat[f1.eyeType]?.includes(f2.eyeType)) score += 20;
  else score += 10;

  return Math.min(score, 100);
}

// ===== 관상 분석 리포트 생성 =====
export function getFaceReadingReport(f1: FaceProfile, f2: FaceProfile): string[] {
  const reports: string[] = [];

  const impressionScore = IMPRESSION_COMPATIBILITY[f1.overallImpression];
  if (impressionScore?.[0] === f2.overallImpression) {
    reports.push(`최고의 관상 궁합! "${IMPRESSION_LABELS[f1.overallImpression]}" 인상과 "${IMPRESSION_LABELS[f2.overallImpression]}" 인상은 음양의 조화를 이룹니다.`);
  } else if (impressionScore?.includes(f2.overallImpression)) {
    reports.push(`좋은 관상 궁합입니다. 서로의 인상이 잘 보완됩니다.`);
  }

  const shapeCompat = FACE_SHAPE_COMPAT[f1.faceShape];
  if (shapeCompat?.includes(f2.faceShape)) {
    reports.push(`${FACE_SHAPE_LABELS[f1.faceShape]}과 ${FACE_SHAPE_LABELS[f2.faceShape]}은 얼굴형 궁합이 좋습니다.`);
  }

  // 관상학 해석
  if (f2.eyeType === 'crescent') {
    reports.push('초승달 눈은 관상학에서 복이 많고 사교적인 성격을 나타냅니다.');
  }
  if (f2.noseType === 'high_straight') {
    reports.push('높은 콧대는 관상학에서 자존감이 높고 리더십이 있음을 나타냅니다.');
  }
  if (f2.lipType === 'full') {
    reports.push('두꺼운 입술은 관상학에서 정이 많고 표현력이 풍부함을 의미합니다.');
  }

  return reports;
}

// ===== 데모용: 인상에서 관상 프로필 추론 =====
export function inferFaceProfile(impression: FaceImpression): FaceProfile {
  const profiles: Record<FaceImpression, FaceProfile> = {
    warm_gentle: {
      faceShape: 'oval', eyeType: 'crescent', noseType: 'round_tip',
      lipType: 'full', overallImpression: 'warm_gentle',
    },
    sharp_charisma: {
      faceShape: 'diamond', eyeType: 'sharp', noseType: 'high_straight',
      lipType: 'thin', overallImpression: 'sharp_charisma',
    },
    cute_youthful: {
      faceShape: 'round', eyeType: 'big_round', noseType: 'small',
      lipType: 'heart', overallImpression: 'cute_youthful',
    },
    elegant_noble: {
      faceShape: 'oval', eyeType: 'almond', noseType: 'high_straight',
      lipType: 'balanced', overallImpression: 'elegant_noble',
    },
    friendly_approachable: {
      faceShape: 'round', eyeType: 'crescent', noseType: 'round_tip',
      lipType: 'wide', overallImpression: 'friendly_approachable',
    },
    strong_reliable: {
      faceShape: 'square', eyeType: 'small', noseType: 'high_straight',
      lipType: 'balanced', overallImpression: 'strong_reliable',
    },
    mysterious_deep: {
      faceShape: 'long', eyeType: 'droopy', noseType: 'aquiline',
      lipType: 'thin', overallImpression: 'mysterious_deep',
    },
    bright_cheerful: {
      faceShape: 'heart', eyeType: 'big_round', noseType: 'small',
      lipType: 'full', overallImpression: 'bright_cheerful',
    },
  };
  return profiles[impression];
}
