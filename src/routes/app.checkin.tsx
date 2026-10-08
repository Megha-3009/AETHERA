import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { calculateReadiness } from "@/lib/readiness";

export const Route = createFileRoute("/app/checkin")({
  component: CheckinPage,
});

function CheckinPage() {
  const navigate = useNavigate();
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(8);
  const [mood, setMood] = useState(5);
  const [soreness, setSoreness] = useState(3);
  const [stress, setStress] = useState(3);
  const [water, setWater] = useState(2);


  async function saveCheckin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const readinessResult = calculateReadiness({
  sleep_hours: sleep,
  energy,
  mood,
  soreness,
  stress,
  water,
});

const { error } = await supabase.from("daily_checkins").insert({
  user_id: user.id,
  energy,
  sleep_hours: sleep,
  mood,
  soreness,
  stress,
  water,
  readiness_score: readinessResult.score,
});

if (error) {
  console.error(error);
  alert("Failed to save check-in.");
  return;
}

  alert("Check-in saved successfully!");

  navigate({ to: "/app" });
}

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Daily Check-in</h1>
        <p className="text-muted-foreground">
          Tell AETHERA how you're feeling today.
        </p>
      </div>

      <Card className="p-6 space-y-6">

        <div>
          <label className="font-medium">
            ⚡ Energy ({energy}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="font-medium">
            😴 Sleep Hours
          </label>
          <Input
            type="number"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">
            😊 Mood ({mood}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="font-medium">
            💪 Muscle Soreness ({soreness}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={soreness}
            onChange={(e) => setSoreness(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="font-medium">
            😓 Stress ({stress}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="font-medium">
            💧 Water Intake (Litres)
          </label>
          <Input
            type="number"
            step="0.5"
            value={water}
            onChange={(e) => setWater(Number(e.target.value))}
          />
        </div>

        <Button className="w-full" onClick={saveCheckin}>
  Save Check-in
</Button>

      </Card>
    </div>
  );
}