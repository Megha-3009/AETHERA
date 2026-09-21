import { supabase } from "@/lib/supabase";
import {
  generateWorkout,
  generateMeal,
  generateReason,
} from "@/lib/ai";

export async function getTodayRecommendation(profile: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today)
    .limit(1)
    .maybeSingle();

  if (existing) return existing;

  const workout = generateWorkout(profile);
  const meal = generateMeal(profile);
  const reason = generateReason(profile);

  const recommendation = {
    user_id: user.id,

    workout_title: workout.title,
    workout_description: workout.description,

    meal_title: meal.title,
    meal_description: meal.description,

    ai_reason: reason,
  };

  const { data, error } = await supabase
    .from("ai_recommendations")
    .insert(recommendation)
    .select()
    .single();

  if (error) throw error;

  return data;
}