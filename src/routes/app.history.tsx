
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Loader2, History, Dumbbell, Clock } from "lucide-react";

export const Route = createFileRoute("/app/history")({
  component: WorkoutHistoryPage,
});

type WorkoutSession = {
  id: string;
  exercise_name: string;
  reps: number;
  duration_seconds: number;
  created_at: string;
};

function WorkoutHistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          setError("Please log in to view your workout history.");
          return;
        }

        const { data, error: queryError } = await supabase
          .from("workout_sessions")
          .select("id, exercise_name, reps, duration_seconds, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (queryError) throw queryError;

        setSessions(data ?? []);
      } catch (err) {
        console.error("Failed to load workout history:", err);
        setError("Unable to load workout history. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Workout History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your previous workout sessions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading workout history...</p>
        </div>
      ) : error ? (
        <Card className="p-5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : sessions.length === 0 ? (
        <Card className="flex flex-col items-center p-10 text-center">
          <History className="mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="font-semibold">No workouts yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete and save a squat session to see it here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">{session.exercise_name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Repetitions</p>
                  <p className="text-2xl font-bold">{session.reps}</p>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="flex items-center gap-1 text-2xl font-bold">
                    <Clock className="h-4 w-4" />
                    {formatDuration(session.duration_seconds)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
