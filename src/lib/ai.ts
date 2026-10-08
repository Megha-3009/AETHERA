

export function generateWorkout(profile: any, readiness?: any) {
  const goal = profile.fitness_goal;
  const level = profile.experience;
  const equipment = profile.equipment;
  const duration =
  readiness?.recommendation === "Recovery"
    ? "20 minutes"
    : readiness?.recommendation === "Light"
      ? "30 minutes"
      : "45 minutes";

  // Low readiness → recovery workout
  if (readiness?.recommendation === "Recovery") {
    return {
      title: "Recovery Workout",
      description:
        "10 min easy walk • Full Body Stretching • Breathing Exercises",
    };
  }

  // Moderate readiness → light workout
  if (readiness?.recommendation === "Light") {
    return {
      title: "Light Workout",
      description:
        "15 min walking • Bodyweight Squats • Wall Push-ups • Light Stretching",
    };
  }

  // Normal workout based on fitness goal
 if (goal === "Lose weight") {
  if (level === "Beginner") {
    return {
      title: "Beginner Fat Burn Workout",
      description:
        equipment === "Gym"
          ? `${duration} • Treadmill Walk • Bodyweight Squats • Assisted Lat Pulldown • Chest Press • Plank`
          : `${duration} • Brisk Walk • Bodyweight Squats • Wall Push-ups • Plank`,
    };
  }

  if (level === "Intermediate") {
    return {
      title: "Fat Burn Workout",
      description:
        equipment === "Gym"
          ? `${duration} • Treadmill • Squats • Lat Pulldown • Chest Press • Plank`
          : `${duration} • Brisk Walk • Squats • Push-ups • Lunges • Plank`,
    };
  }

  return {
    title: "Advanced Fat Burn Workout",
    description:
      equipment === "Gym"
        ? `${duration} • Incline Treadmill • Barbell Squats • Lat Pulldown • Chest Press • Walking Lunges • Plank`
        : `${duration} • HIIT • Squats • Push-ups • Lunges • Mountain Climbers • Plank`,
  };
}

  if (goal === "Gain muscle") {
   return {
  title: "Muscle Building Workout",
  description:
    `${duration} • Bench Press • Shoulder Press • Deadlift • Rows • Biceps Curl`,
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
export function generateMeal(
  profile: any,
  readiness?: any,
  calories?: number
) {
  const veg = profile.food_preference === "Vegetarian";
  const budget = profile.budget;
  const goal = profile.fitness_goal;
  const portion =
  !calories || calories < 1600
    ? {
        oats: "40g oats",
        eggs: "2 eggs",
        rice: "3/4 cup cooked rice",
        chicken: "100g chicken",
        fish: "100g fish",
        chapati: "1 chapati",
        paneer: "100g paneer",
        milk: "200ml milk",
        fruit: "1 serving fruit",
        peanuts: "20g peanuts",
      }
    : calories <= 2000
      ? {
          oats: "50g oats",
          eggs: "2 eggs",
          rice: "1 cup cooked rice",
          chicken: "120g chicken",
          fish: "120g fish",
          chapati: "2 chapatis",
          paneer: "120g paneer",
          milk: "250ml milk",
          fruit: "1 serving fruit",
          peanuts: "25g peanuts",
        }
      : {
          oats: "60g oats",
          eggs: "3 eggs",
          rice: "1.5 cups cooked rice",
          chicken: "150g chicken",
          fish: "150g fish",
          chapati: "2–3 chapatis",
          paneer: "150g paneer",
          milk: "300ml milk",
          fruit: "1–2 servings fruit",
          peanuts: "30g peanuts",
        };
  const calorieTarget = `Daily target: approximately ${calories ?? 0} kcal.`;

  // Low readiness → recovery nutrition
  if (readiness?.recommendation === "Recovery") {
    return {
      title: "Recovery Nutrition Plan",
      description: veg
        ? `${calorieTarget}
Breakfast: Oats + Milk
Lunch: Dal + Rice + Vegetables
Snack: Banana + Peanuts
Dinner: Paneer + Chapati
Focus on balanced portions and adequate hydration for recovery.`
        : `${calorieTarget}
Breakfast: ${portion.eggs} + ${portion.oats}
Lunch: ${portion.chicken} + ${portion.rice} + Vegetables
Snack: Banana + ${portion.milk}
Dinner: ${portion.fish} + ${portion.chapati} + Vegetables
Focus on balanced portions and adequate hydration for recovery.`,
    };
  }

  // Weight loss
  if (goal === "Lose weight") {
    return {
      title: "Fat Loss Nutrition Plan",
      description: veg
        ? budget === "Low"
          ? `${calorieTarget}
Breakfast: Oats + Milk
Lunch: Rice + Dal + Vegetables
Snack: Peanuts + Fruit
Dinner: Chapati + Paneer
Keep rice/chapati portions moderate and prioritize vegetables and protein.`
          : `${calorieTarget}
Breakfast: Greek Yogurt + Fruit
Lunch: Paneer Rice Bowl
Snack: Almonds
Dinner: Tofu + Vegetables
Keep portions controlled while prioritizing protein and vegetables.`
        : `${calorieTarget}
Breakfast: Eggs + Oats
Lunch: Chicken + Rice + Vegetables
Snack: Fruit + Milk
Dinner: Fish + Vegetables
Keep carbohydrate portions moderate and prioritize protein and vegetables.`,
    };
  }

  // Muscle gain
  if (goal === "Gain muscle") {
    return {
      title: "Muscle Building Nutrition Plan",
      description: veg
        ? `${calorieTarget}
Breakfast: Oats + Milk + Banana
Lunch: Paneer + Rice + Dal
Snack: Peanuts + Milk
Dinner: Tofu + Chapati
Prioritize sufficient portions and protein throughout the day.`
        : `${calorieTarget}
Breakfast: Eggs + Oats + Banana
Lunch: Chicken + Rice
Snack: Milk + Peanuts
Dinner: Fish + Chapati + Vegetables
Prioritize sufficient portions and protein throughout the day.`,
    };
  }

  // Default
  return {
    title: "Balanced Nutrition Plan",
    description: veg
      ? `${calorieTarget}
Breakfast: Oats + Milk
Lunch: Rice + Dal + Vegetables
Snack: Fruit + Peanuts
Dinner: Chapati + Paneer`
      : `${calorieTarget}
Breakfast: Eggs + Oats
Lunch: Chicken + Rice + Vegetables
Snack: Fruit + Milk
Dinner: Fish + Vegetables`,
  };
}

export function generateReason(profile: any) {
  return `Generated based on your goal (${profile.fitness_goal}), experience (${profile.experience}) and food preference (${profile.food_preference}).`;
}


export function generateReadinessReason(checkin: any, readiness: any) {
  const reasons: string[] = [];

  if (checkin.sleep_hours < 6) {
    reasons.push("poor sleep");
  } else if (checkin.sleep_hours >= 8) {
    reasons.push("good sleep");
  }

  if (checkin.energy <= 4) {
    reasons.push("low energy");
  } else if (checkin.energy >= 8) {
    reasons.push("high energy");
  }

  if (checkin.soreness >= 7) {
    reasons.push("high muscle soreness");
  }

  if (checkin.stress >= 7) {
    reasons.push("high stress");
  }

  if (checkin.mood <= 4) {
    reasons.push("low mood");
  }

  if (checkin.water < 1.5) {
    reasons.push("low water intake");
  }

  if (reasons.length === 0) {
    return `Your ${readiness.level.toLowerCase()} readiness supports a ${readiness.recommendation.toLowerCase()} workout today.`;
  }

  return `Your readiness is ${readiness.level.toLowerCase()} due to ${reasons.join(", ")}. A ${readiness.recommendation.toLowerCase()} workout is recommended.`;
}