
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Apple,
  Plus,
  Trash2,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateDailyMealPlan } from "@/lib/mealPlanner";
import {
  calculateBMR,
  calculateCalories,
  calculateProtein,
} from "@/lib/fitness";

export const Route = createFileRoute("/app/nutrition")({
  component: NutritionPage,
});

type Food = {
  id: string;
  name: string;
  serving: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
};

type FoodEntry = Food & {
  entryId: string;
  grams: number;
};

const foods: Food[] = [
  { id: "idli", name: "Idli", serving: 100, calories: 146, protein: 4, carbs: 29, fat: 1, category: "Breakfast" },
  { id: "dosa", name: "Plain dosa", serving: 100, calories: 168, protein: 4, carbs: 27, fat: 5, category: "Breakfast" },
  { id: "rice", name: "Cooked white rice", serving: 100, calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "Rice" },
  { id: "sambar", name: "Sambar", serving: 100, calories: 65, protein: 3, carbs: 9, fat: 2, category: "Side dish" },
  { id: "chapati", name: "Chapati", serving: 40, calories: 120, protein: 3.5, carbs: 20, fat: 3, category: "Main meal" },
  { id: "egg", name: "Boiled egg", serving: 50, calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, category: "Protein" },
  { id: "chicken", name: "Cooked chicken breast", serving: 100, calories: 165, protein: 31, carbs: 0, fat: 3.6, category: "Protein" },
  { id: "paneer", name: "Paneer", serving: 100, calories: 265, protein: 18, carbs: 3.5, fat: 20, category: "Protein" },
  { id: "dal", name: "Cooked dal", serving: 100, calories: 116, protein: 7, carbs: 20, fat: 0.4, category: "Protein" },
  { id: "milk", name: "Milk", serving: 100, calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, category: "Dairy" },
  { id: "banana", name: "Banana", serving: 100, calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, category: "Fruit" },
  { id: "apple", name: "Apple", serving: 100, calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, category: "Fruit" },
  { id: "peanuts", name: "Peanuts", serving: 100, calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2, category: "Snack" },
  { id: "oats", name: "Oats", serving: 100, calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, category: "Breakfast" },
];

function NutritionPage() {
  
const [profile, setProfile] = useState<any>(null);
const nutritionTargets = useMemo(() => {
  if (
    !profile ||
    !Number(profile.age) ||
    !Number(profile.height) ||
    !Number(profile.weight)
  ) {
    return null;
  }

  const bmr = calculateBMR(
    profile.gender,
    Number(profile.weight),
    Number(profile.height),
    Number(profile.age)
  );

  const calories = calculateCalories(
    bmr,
    profile.activity_level,
    profile.fitness_goal
  );

  const protein = calculateProtein(
    Number(profile.weight),
    profile.fitness_goal
  );

  return {
    calories: Math.max(1200, calories),
    protein,
  };
}, [profile]);

const dailyMealPlan = useMemo(() => {
  if (!profile || !nutritionTargets) return null;

  return generateDailyMealPlan(
    profile,
    nutritionTargets.calories,
    nutritionTargets.protein
  );
}, [profile, nutritionTargets]);
const [profileLoading, setProfileLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("idli");
  const [grams, setGrams] = useState("100");
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
  let active = true;

  async function loadFoodLogs() {
    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;

      if (!userData.user) {
        if (active) {
          setMessage("Please log in to save and view your food log.");
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("logged_at", new Date().toLocaleDateString("en-CA"))
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (active) {
        setEntries(
          (data ?? []).map((row) => ({
            id: row.food_name,
            name: row.food_name,
            category: "Logged food",
            entryId: row.id,
            grams: Number(row.serving_grams),
            serving: Number(row.serving_grams),
            calories: Number(row.calories),
            protein: Number(row.protein_g),
            carbs: Number(row.carbs_g),
            fat: Number(row.fat_g),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load food logs:", error);
      if (active) setMessage("Could not load food logs. Please try again.");
    } finally {
      if (active) setLoading(false);
    }
  }

  void loadFoodLogs();

  return () => {
    active = false;
  };
}, []);


useEffect(() => {
  let active = true;

  async function loadProfile() {
    setProfileLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        if (active) setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "age, gender, height, weight, fitness_goal, activity_level, experience, equipment, food_preference, allergies, budget"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (active) setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      if (active) {
        setMessage("Could not load your profile. Please try again.");
      }
    } finally {
      if (active) setProfileLoading(false);
    }
  }

  void loadProfile();

  return () => {
    active = false;
  };
}, []);


  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFood = foods.find((food) => food.id === selectedId);

  const totals = useMemo(
    () =>
      entries.reduce(
        (sum, item) => {
          const factor = item.grams / item.serving;
          return {
            calories: sum.calories + item.calories * factor,
            protein: sum.protein + item.protein * factor,
            carbs: sum.carbs + item.carbs * factor,
            fat: sum.fat + item.fat * factor,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [entries]
  );

  async function addFood() {
  if (!selectedFood || saving) return;

  const amount = Number(grams);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
    setMessage("Enter a portion between 1 and 5000 grams.");
    return;
  }

  setSaving(true);
  setMessage("");

  try {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError) throw userError;

    const user = userData.user;

    if (!user) {
      setMessage("Please log in before adding food.");
      return;
    }

    const factor = amount / selectedFood.serving;

    const { data, error } = await supabase
      .from("food_logs")
      .insert({
        user_id: user.id,
        food_name: selectedFood.name,
        serving_grams: amount,
        calories: selectedFood.calories * factor,
        protein_g: selectedFood.protein * factor,
        carbs_g: selectedFood.carbs * factor,
        fat_g: selectedFood.fat * factor,
        logged_at: new Date().toLocaleDateString("en-CA"),
      })
      .select()
      .single();

    if (error) throw error;

    setEntries((current) => [
      ...current,
      {
        id: selectedFood.id,
        name: selectedFood.name,
        category: selectedFood.category,
        entryId: data.id,
        grams: amount,
        serving: amount,
        calories: Number(data.calories),
        protein: Number(data.protein_g),
        carbs: Number(data.carbs_g),
        fat: Number(data.fat_g),
      },
    ]);

    setMessage(`${selectedFood.name} saved to today's food log.`);
  } catch (error) {
    console.error("Failed to save food:", error);
    setMessage("Could not save food. Check your login and Supabase settings.");
  } finally {
    setSaving(false);
  }
}

async function removeFood(entryId: string) {
  setMessage("");

  try {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError) throw userError;

    if (!userData.user) {
      setMessage("Please log in to remove food.");
      return;
    }

    const { error } = await supabase
      .from("food_logs")
      .delete()
      .eq("id", entryId)
      .eq("user_id", userData.user.id);

    if (error) throw error;

    setEntries((current) =>
      current.filter((item) => item.entryId !== entryId)
    );

    setMessage("Food entry removed.");
  } catch (error) {
    console.error("Failed to remove food:", error);
    setMessage("Could not remove food. Please try again.");
  }
}

  const goal = Math.max(0, Number(calorieGoal) || 0);
  const progress = goal > 0 ? Math.min(100, (totals.calories / goal) * 100) : 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <div className="flex items-center gap-2">
          <Apple className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Nutrition & Food Tracker</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your food intake and estimate calories and macronutrients.
        </p>
        <Badge variant="secondary" className="mt-3">
          Food database estimates
        </Badge>
      </div>

      <Card className="space-y-4 p-5">
        <div>
          <h2 className="font-semibold">Daily calorie goal</h2>
          <p className="text-sm text-muted-foreground">
            Change this to your target calories for the day.
          </p>
        </div>
        <Input
          type="number"
          min="1"
          max="10000"
          value={calorieGoal}
          onChange={(event) => setCalorieGoal(event.target.value)}
          aria-label="Daily calorie goal"
        />
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Calories consumed</p>
            <p className="text-3xl font-bold">
              {Math.round(totals.calories)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                / {goal} kcal
              </span>
            </p>
          </div>
          <Flame className="h-8 w-8 text-orange-500" />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {Math.max(0, Math.round(goal - totals.calories))} kcal remaining
          {totals.calories > goal ? " — daily goal exceeded." : "."}
        </p>
      </Card>

      {/* Personalized Daily Meal Plan */}
<Card className="p-5">
  <div className="mb-4">
    <h2 className="text-xl font-semibold">Your Daily Meal Plan</h2>
    <p className="text-sm text-muted-foreground">
      Personalized using your fitness goal and food preferences.
    </p>
  </div>

  {profileLoading ? (
    <p className="text-sm text-muted-foreground">
      Loading your profile...
    </p>
  ) : !dailyMealPlan ? (
    <p className="text-sm text-muted-foreground">
      Complete your profile to get a personalized meal plan.
    </p>
  ) : (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm text-muted-foreground">Daily calories</p>
          <p className="text-2xl font-bold">
            {dailyMealPlan.dailyCalories} kcal
          </p>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm text-muted-foreground">Protein target</p>
          <p className="text-2xl font-bold">
            {dailyMealPlan.dailyProtein} g
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(dailyMealPlan.meals).map((meal) => (
          <div
            key={meal.name}
            className="rounded-lg border p-4"
          >
            <h3 className="font-semibold">{meal.name}</h3>

            <ul className="my-2 list-inside list-disc space-y-1">
              {meal.foods.map((food, index) => (
                <li key={`${meal.name}-${index}`} className="text-sm">
                  {food}
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground">{meal.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {dailyMealPlan.disclaimer}
      </p>
    </>
  )}
</Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <MacroCard
          icon={<Beef className="h-5 w-5" />}
          label="Protein"
          value={totals.protein}
          unit="g"
        />
        <MacroCard
          icon={<Wheat className="h-5 w-5" />}
          label="Carbohydrates"
          value={totals.carbs}
          unit="g"
        />
        <MacroCard
          icon={<Droplets className="h-5 w-5" />}
          label="Fat"
          value={totals.fat}
          unit="g"
        />
      </div>

      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Add food</h2>
        </div>

        <Input
          placeholder="Search Indian foods..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search foods"
        />

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filteredFoods.map((food) => (
            <button
              type="button"
              key={food.id}
              onClick={() => {
                setSelectedId(food.id);
                setGrams(String(food.serving));
              }}
              className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                selectedId === food.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <span>
                <span className="block font-medium">{food.name}</span>
                <span className="text-xs text-muted-foreground">
                  {food.category} · per {food.serving} g
                </span>
              </span>
              <span className="text-sm font-semibold">
                {food.calories} kcal
              </span>
            </button>
          ))}
          {filteredFoods.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No matching foods in this starter database.
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <label htmlFor="food-grams" className="text-sm font-medium">
              Portion size (grams)
            </label>
            <Input
              id="food-grams"
              type="number"
              min="1"
              max="5000"
              value={grams}
              onChange={(event) => setGrams(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={addFood} disabled={saving}>
  <Plus className="mr-2 h-4 w-4" />
  {saving ? "Saving..." : "Add to food log"}
</Button>
          </div>
        </div>

        {selectedFood && Number(grams) > 0 && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-medium">Estimated for {grams} g of {selectedFood.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {Math.round(selectedFood.calories * Number(grams) / selectedFood.serving)} kcal ·{" "}
              {(selectedFood.protein * Number(grams) / selectedFood.serving).toFixed(1)} g protein ·{" "}
              {(selectedFood.carbs * Number(grams) / selectedFood.serving).toFixed(1)} g carbs ·{" "}
              {(selectedFood.fat * Number(grams) / selectedFood.serving).toFixed(1)} g fat
            </p>
          </div>
        )}
        {message && (
          <p role="status" className="text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </Card>

      <Card className="space-y-4 p-5">
        <div>
          <h2 className="font-semibold">Today's food log</h2>
          <p className="text-sm text-muted-foreground">
            Items added during this page session.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="py-8 text-center">
            <Apple className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No food logged yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a food above to start tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const factor = entry.grams / entry.serving;
              return (
                <div
                  key={entry.entryId}
                  className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.grams} g · {Math.round(entry.calories * factor)} kcal
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFood(entry.entryId)}
                    aria-label={`Remove ${entry.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Nutrition values are approximate and vary with ingredients, cooking
        methods, and portion measurements. This starter version stores the log
        only in page memory; it does not yet save food entries to Supabase or
        recognize food from photos.
      </p>
    </div>
  );
}

function MacroCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">
        {value.toFixed(1)} <span className="text-sm font-normal">{unit}</span>
      </p>
    </Card>
  );
}
