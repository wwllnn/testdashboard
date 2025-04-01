// utils/scoreUtils.ts
import Fraction from 'fraction.js';

export const buildFrequencyMap = (data: any[], key: string): Map<string, number> => {
  const map = new Map<string, number>();
  data.forEach(item => {
    map.set(item[key], (map.get(item[key]) || 0) + 1);
  });
  return map;
};

export const getWrongAnswers = (sectionData: any[], userAnswers: any[], offset: number) => {
  const topics: string[] = [];
  const difficulties: string[] = [];
  const wrongs: [number, any][] = [];

  userAnswers.forEach((userAnswer, i) => {
    const correctAnswer = sectionData[i].answer;
    if (!compareAnswers(userAnswer, correctAnswer)) {
      topics.push(sectionData[i].topic);
      difficulties.push(sectionData[i].difficulty);
      wrongs.push([i + offset, userAnswer]);
    }
  });

  return { topics, difficulties, wrongs };
};

export const compareAnswers = (userAnswer: any, correctAnswer: any): boolean => {
  if (userAnswer === null || correctAnswer === null) return false;

  if (typeof userAnswer === 'string' && /^[A-Za-z]+$/.test(userAnswer)) {
    return userAnswer === correctAnswer;
  }

  try {
    const userDecimal = Math.round(parseToDecimal(userAnswer) * 1000) / 1000;
    const correctDecimal = Math.round(parseToDecimal(correctAnswer) * 1000) / 1000;
    return userDecimal === correctDecimal;
  } catch {
    return false;
  }
};

export const parseToDecimal = (value: string | number): number => {
  if (typeof value === 'string') {
    return value.includes('/') ? new Fraction(value).valueOf() : parseFloat(value);
  }
  return value;
};

export const adjustWrongMap = (originalMap: Map<string, number>, wrongKeys: string[]) => {
  const map = new Map(originalMap);
  for (const key of wrongKeys) {
    map.set(key, (map.get(key) || 0) - 1);
  }
  return map;
};

export const getZippedMap = (
  fullMap: Map<string, number>,
  wrongMap: Map<string, number>
): Map<string, [number, number]> => {
  return new Map(
    [...fullMap.keys()]
      .filter(key => wrongMap.has(key))
      .map(key => [key, [fullMap.get(key)!, wrongMap.get(key)!]])
  );
};

export const calculatePercentage = (correct: number, total: number) => {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
};

export const getSatPercentile = (score: number) => {
  const mean = 1060;
  const stdDev = 240;
  const z = (score - mean) / stdDev;
  let percentile = normalCDF(z) * 100;

  if (score >= 1600) return 99;
  if (score >= 1550) return Math.max(percentile - 5, 96);
  if (score >= 1500) return Math.max(percentile - 7, 92);
  if (score >= 1400) return Math.max(percentile - 10, 85);
  if (score >= 1300) return Math.max(percentile - 12, 78);
  if (score >= 1200) return Math.max(percentile - 14, 68);
  if (score >= 1100) return Math.max(percentile - 16, 52);
  if (score >= 1000) return Math.max(percentile - 18, 32);
  if (score >= 900) return Math.max(percentile - 20, 18);
  if (score >= 800) return Math.max(percentile - 22, 7);
  return Math.max(percentile - 23, 1);
};

export const normalCDF = (z: number) => (1 + erf(z / Math.SQRT2)) / 2;

export const erf = (x: number) => {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));

  return sign * y;
};
