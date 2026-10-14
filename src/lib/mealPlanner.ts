
export type Meal = {
  name: string;
  foods: string[];
  note: string;
};

export type DailyMealPlan = {
  title: string;
  dailyCalories: number;
  dailyProtein: number;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
  };
  disclaimer: string;
};

export function generateDailyMealPlan(
  profile: any,
  calorieTarget: number,
  proteinTarget: number
): DailyMealPlan {
  const vegetarian =
    String(profile.food_preference ?? "")
      .toLowerCase()
      .includes("vegetarian") &&
    !String(profile.food_preference ?? "")
      .toLowerCase()
      .includes("non-vegetarian");

  const allergies = Array.isArray(profile.allergies)
    ? profile.allergies.map((item: unknown) =>
        String(item).toLowerCase().trim()
      )
    : String(profile.allergies ?? "")
        .toLowerCase()
        .split(/[,;]/)
        .map((item) => item.trim())
        .filter(Boolean);

  const budget = String(profile.budget ?? "").toLowerCase();

  const hasAllergy = (...terms: string[]) =>
    allergies.some((allergy: string) =>
      terms.some((term) => allergy.includes(term))
    );

  const avoidEggs = hasAllergy("egg");
  const avoidMilk = hasAllergy("milk", "dairy", "lactose");
  const avoidPeanuts = hasAllergy("peanut", "groundnut");
  const avoidWheat = hasAllergy("wheat", "gluten");
  const avoidSoy = hasAllergy("soy", "soya");
  const avoidFish = hasAllergy("fish", "seafood");
  const avoidChicken = hasAllergy("chicken", "poultry");
  const avoidDal = hasAllergy("dal", "lentil", "legume", "pulse");

  const proteinOptions = vegetarian
    ? [
        ...(avoidDal ? [] : ["Dal"]),
        ...(avoidMilk ? [] : ["Milk"]),
        ...(avoidSoy ? [] : ["Tofu"]),
        ...(avoidMilk ? [] : ["Paneer"]),
        ...(avoidPeanuts ? [] : ["Peanuts"]),
      ]
    : [
        ...(avoidEggs ? [] : ["Eggs"]),
        ...(avoidChicken ? [] : ["Chicken"]),
        ...(avoidFish ? [] : ["Fish"]),
        ...(avoidDal ? [] : ["Dal"]),
        ...(avoidMilk ? [] : ["Milk"]),
      ];

  const safeProtein =
    proteinOptions.length > 0
      ? proteinOptions
      : ["A suitable protein source after checking your allergies"];

  const breakfastProtein =
    safeProtein.find((item) => item !== "Peanuts") ?? safeProtein[0];

  const lunchProtein =
    safeProtein.find(
      (item) => item !== breakfastProtein && item !== "Milk"
    ) ?? safeProtein[0];

  const dinnerProtein =
    [...safeProtein].reverse().find(
      (item) => item !== breakfastProtein && item !== lunchProtein
    ) ?? safeProtein[0];

  const grain = avoidWheat ? "Rice" : "Rice or chapati";
  const breakfastGrain = avoidWheat ? "Rice-based breakfast" : "Oats or idli";

  const meals = {
    breakfast: {
      name: "Breakfast",
      foods: [
        breakfastGrain,
        ...(avoidMilk ? [] : ["Milk, if tolerated"]),
        breakfastProtein,
      ],
      note: "Start with a balanced meal and a protein source.",
    },
    lunch: {
      name: "Lunch",
      foods: [
        grain,
        lunchProtein,
        "Cooked vegetables",
      ],
      note: "Include vegetables and adjust portions to your needs.",
    },
    snack: {
      name: "Evening snack",
      foods: [
        "Seasonal fruit",
        ...(avoidPeanuts ? [] : ["Peanuts, if tolerated"]),
      ],
      note: "Choose a practical snack that fits your hunger.",
    },
    dinner: {
      name: "Dinner",
      foods: [
        grain,
        dinnerProtein,
        "Cooked vegetables",
      ],
      note: "Aim for a balanced dinner rather than skipping meals.",
    },
  };

  const goal = String(profile.fitness_goal ?? "Stay active");
  const affordable = budget.includes("low") || budget.includes("budget");

  return {
    title: `${goal} — Indian Meal Plan`,
    dailyCalories: calorieTarget,
    dailyProtein: proteinTarget,
    meals,
    disclaimer:
      "Starter recommendations only. Nutrition values depend on portions and preparation. Check ingredient labels and cross-contamination for allergies. This plan does not calculate the calories or protein of its individual meals.",
  };
}
