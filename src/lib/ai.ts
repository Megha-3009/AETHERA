export function generateWorkout(profile: any) {
  const goal = profile.fitness_goal;
  const level = profile.experience;
  const equipment = profile.equipment;

  if (goal === "Lose weight") {
    return {
      title: "Fat Burn Workout",
      description:
        equipment === "Gym"
          ? "10 min treadmill • Squats • Lat Pulldown • Chest Press • Plank"
          : "20 min brisk walk • Squats • Push-ups • Plank",
    };
  }

  if (goal === "Gain muscle") {
    return {
      title: "Muscle Building Workout",
      description:
        "Bench Press • Shoulder Press • Deadlift • Rows • Biceps Curl",
    };
  }

  return {
    title: "Stay Active",
    description:
      level === "Beginner"
        ? "30 min walk + Full Body Stretch"
        : "Full Body Strength Workout",
  };
}

export function generateMeal(profile: any) {
  const veg = profile.food_preference === "Vegetarian";
  const budget = profile.budget;

  if (veg) {
    return {
      title: "High Protein Vegetarian Diet",
      description:
        budget === "Low"
          ? "Breakfast: Oats\nLunch: Rice + Dal\nSnack: Peanuts\nDinner: Chapati + Paneer"
          : "Breakfast: Greek Yogurt\nLunch: Paneer Rice Bowl\nSnack: Almonds\nDinner: Tofu Curry",
    };
  }

  return {
    title: "High Protein Diet",
    description:
      "Breakfast: Eggs\nLunch: Chicken Rice\nSnack: Milk\nDinner: Fish + Vegetables",
  };
}

export function generateReason(profile: any) {
  return `Generated based on your goal (${profile.fitness_goal}), experience (${profile.experience}) and food preference (${profile.food_preference}).`;
}