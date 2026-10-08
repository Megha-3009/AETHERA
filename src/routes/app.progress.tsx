import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/app/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const [checkins, setCheckins] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("daily_checkins")
      .select("created_at, readiness_score")
      .eq("user_id", user.id)
      .not("readiness_score", "is", null)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setCheckins(data ?? []);
  }
  const chartData = checkins.map((item) => ({
  date: new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  }),
  score: item.readiness_score,
}));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Progress</h1>
        <p className="text-muted-foreground">
          Track how your daily readiness changes over time.
        </p>
      </div>

      <Card className="p-6">
  <h2 className="text-xl font-bold">Readiness Trend</h2>
  <p className="mt-1 text-sm text-muted-foreground">
    Your readiness score over time.
  </p>

  <div className="mt-6 h-72 w-full">
    {chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            strokeWidth={3}
            dot
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Complete daily check-ins to see your trend.
      </div>
    )}
  </div>
</Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold">Readiness History</h2>

        {checkins.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Complete your daily check-in to start tracking readiness.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {checkins.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Daily readiness score
                  </p>
                </div>

                <div className="text-2xl font-bold">
                  {item.readiness_score}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}