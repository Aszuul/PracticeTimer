// Timer utilities
// Format seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Calculate skills time (first half of total time)
export const getSkillsTimeSeconds = (totalMinutes: number): number => {
  return Math.floor((totalMinutes * 60) / 2);
};

// Calculate target time (second half of total time)
export const getTargetTimeSeconds = (totalMinutes: number): number => {
  return totalMinutes * 60 - getSkillsTimeSeconds(totalMinutes);
};

// Determine phase based on elapsed seconds
export const getPhase = (
  elapsedSeconds: number,
  totalMinutes: number
): 'skills' | 'target' => {
  const skillsTime = getSkillsTimeSeconds(totalMinutes);
  return elapsedSeconds < skillsTime ? 'skills' : 'target';
};
