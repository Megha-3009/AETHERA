export type ReadinessInput = {
  sleep_hours: number;
  energy: number;
  mood: number;
  soreness: number;
  stress: number;
  water: number;
};

export function calculateReadiness(data: ReadinessInput) {
  // Sleep: 8 hours is considered optimal
  const sleepScore = Math.min((data.sleep_hours / 8) * 100, 100);

  // Energy, mood: higher is better
  const energyScore = data.energy * 10;
  const moodScore = data.mood * 10;

  // Soreness and stress: lower is better
  const sorenessScore = (10 - data.soreness) * 10;
  const stressScore = (10 - data.stress) * 10;

  // Water: 3L is the target
  const waterScore = Math.min((data.water / 3) * 100, 100);

  const score = Math.round(
    sleepScore * 0.25 +
    energyScore * 0.20 +
    moodScore * 0.15 +
    sorenessScore * 0.15 +
    stressScore * 0.10 +
    waterScore * 0.15
  );

  let level: "Excellent" | "Good" | "Moderate" | "Low";
  let recommendation: "Heavy" | "Moderate" | "Light" | "Recovery";

  if (score >= 85) {
    level = "Excellent";
    recommendation = "Heavy";
  } else if (score >= 70) {
    level = "Good";
    recommendation = "Moderate";
  } else if (score >= 50) {
    level = "Moderate";
    recommendation = "Light";
  } else {
    level = "Low";
    recommendation = "Recovery";
  }

  return {
    score,
    level,
    recommendation,
  };
}