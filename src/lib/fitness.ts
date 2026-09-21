// BMI
export function calculateBMI(height: number, weight: number) {
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}

// BMI Category
export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// BMR (Mifflin-St Jeor Formula)
export function calculateBMR(
  gender: string,
  weight: number,
  height: number,
  age: number
) {
  if (gender === "Male") {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }

  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

// Daily Calories
export function calculateCalories(
  bmr: number,
  activity: string,
  goal: string
) {
  let multiplier = 1.2;

  switch (activity) {
    case "Sedentary":
      multiplier = 1.2;
      break;
    case "Light":
      multiplier = 1.375;
      break;
    case "Moderate":
      multiplier = 1.55;
      break;
    case "Active":
      multiplier = 1.725;
      break;
    case "Very Active":
      multiplier = 1.9;
      break;
  }

  let calories = bmr * multiplier;

  if (goal === "Lose weight") calories -= 500;
  if (goal === "Gain muscle") calories += 300;

  return Math.round(calories);
}

// Protein
export function calculateProtein(weight: number, goal: string) {
  if (goal === "Lose weight") return Math.round(weight * 1.8);

  if (goal === "Gain muscle") return Math.round(weight * 2.0);

  return Math.round(weight * 1.5);
}

// Water
export function calculateWater(weight: number) {
  return (weight * 35 / 1000).toFixed(1);
}