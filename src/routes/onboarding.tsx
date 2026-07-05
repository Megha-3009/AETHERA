import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, HeartPulse, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

type OnboardingData = {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bodyType: string;
  goal: string;
  mode: string;
  equipment: string[];
  experience: string;
  conditions: string;
  disabilities: string;
  foodPreference: string;
  allergies: string;
  budget: string;
};

const initial: OnboardingData = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  bodyType: "",
  goal: "",
  mode: "",
  equipment: [],
  experience: "",
  conditions: "",
  disabilities: "",
  foodPreference: "",
  allergies: "",
  budget: "",
};

const MODES = [
  { id: "gym", label: "Gym", desc: "Full equipment access" },
  { id: "home", label: "Home Workout", desc: "Bodyweight & minimal gear" },
  { id: "home-gym", label: "Home Gym", desc: "Personal setup at home" },
  { id: "zumba", label: "Zumba", desc: "Dance-based cardio" },
  { id: "walking", label: "Walking & Cardio", desc: "Steps and low-impact" },
];

const GOALS = ["Lose weight", "Build muscle", "Stay active", "Improve stamina", "Recovery"];
const BODY_TYPES = ["Ectomorph", "Mesomorph", "Endomorph", "Not sure"];
const EQUIPMENT = ["Dumbbells", "Resistance bands", "Yoga mat", "Barbell", "Kettlebell", "None"];
const EXPERIENCES = ["Beginner", "Intermediate", "Advanced"];
const FOOD_PREFS = ["Vegetarian", "Vegan", "Non-vegetarian", "Eggetarian", "Jain"];
const BUDGETS = ["Low", "Medium", "High"];

const SENIOR_THRESHOLD = 60;

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initial);
  const [seniorShown, setSeniorShown] = useState(false);

  const steps = [
    "Basics",
    "Body",
    "Goal & Mode",
    "Equipment & Experience",
    "Health",
    "Nutrition",
    "Summary",
  ];
  const total = steps.length;
  const progress = ((step + 1) / total) * 100;

  const ageNum = Number(data.age);
  const isSenior = ageNum >= SENIOR_THRESHOLD;

  function update<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function next() {
    // Senior mode intro after Basics step
    if (step === 0 && isSenior && !seniorShown) {
      setSeniorShown(true);
      return;
    }
    if (step < total - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }
  function finish() {
    toast.success("Your personalized plan is ready");
    navigate({ to: "/app" });
  }

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return data.name.trim().length > 1 && ageNum > 0 && data.gender.length > 0;
      case 1:
        return data.height.length > 0 && data.weight.length > 0 && data.bodyType.length > 0;
      case 2:
        return data.goal.length > 0 && data.mode.length > 0;
      case 3:
        return data.experience.length > 0;
      case 4:
        return true;
      case 5:
        return data.foodPreference.length > 0 && data.budget.length > 0;
      default:
        return true;
    }
  }, [step, data, ageNum]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 right-0 h-[380px] w-[380px] rounded-full bg-accent/15 blur-3xl" />
      </div>
      <header className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-32 pt-2">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>
              Step {step + 1} of {total} · {steps[step]}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <AnimatePresence mode="wait">
          {seniorShown && step === 0 && isSenior ? (
            <motion.div
              key="senior"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <Card className="p-6 sm:p-8">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-bold">Senior Fitness Mode</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We've noticed you're {ageNum} — AETHERA will automatically enable Senior Fitness
                  Mode. Your plan will focus on mobility, balance, joint health, and gentle
                  progression. You can adjust intensity anytime from your profile.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setSeniorShown(false)}>
                    Back
                  </Button>
                  <Button className="bg-gradient-primary text-white" onClick={() => setStep(1)}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-6 sm:p-8">
                {step === 0 && (
                  <StepBasics data={data} update={update} />
                )}
                {step === 1 && <StepBody data={data} update={update} />}
                {step === 2 && <StepGoalMode data={data} update={update} />}
                {step === 3 && <StepEquipment data={data} update={update} />}
                {step === 4 && <StepHealth data={data} update={update} />}
                {step === 5 && <StepNutrition data={data} update={update} />}
                {step === 6 && <StepSummary data={data} isSenior={isSenior} />}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < total - 1 ? (
            <Button onClick={next} disabled={!canProceed} className="bg-gradient-primary text-white hover:opacity-90">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finish} className="bg-gradient-primary text-white hover:opacity-90">
              Enter AETHERA <Sparkles className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- Step components ---------- */

type StepProps = {
  data: OnboardingData;
  update: <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => void;
};

function StepTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

function StepBasics({ data, update }: StepProps) {
  return (
    <div>
      <StepTitle title="Tell us about you" desc="We'll use this to personalize everything." />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={data.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" inputMode="numeric" value={data.age} onChange={(e) => update("age", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup value={data.gender} onValueChange={(v) => update("gender", v)} className="grid grid-cols-3 gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <Pill key={g} value={g} selected={data.gender === g} onSelect={() => update("gender", g)} />
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBody({ data, update }: StepProps) {
  return (
    <div>
      <StepTitle title="Your body" desc="We'll estimate metrics from these later." />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" inputMode="numeric" value={data.height} onChange={(e) => update("height", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" inputMode="numeric" value={data.weight} onChange={(e) => update("weight", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Body type</Label>
          <div className="grid grid-cols-2 gap-2">
            {BODY_TYPES.map((b) => (
              <Pill key={b} value={b} selected={data.bodyType === b} onSelect={() => update("bodyType", b)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepGoalMode({ data, update }: StepProps) {
  return (
    <div>
      <StepTitle title="Your goal & workout mode" />
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Primary goal</Label>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <Pill key={g} value={g} selected={data.goal === g} onSelect={() => update("goal", g)} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Workout mode</Label>
          <div className="grid gap-2">
            {MODES.map((m) => {
              const selected = data.mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update("mode", m.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-4 text-left transition-all",
                    selected ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-accent/5",
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full border", selected && "border-primary bg-primary text-white")}>
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepEquipment({ data, update }: StepProps) {
  function toggle(item: string) {
    const has = data.equipment.includes(item);
    update("equipment", has ? data.equipment.filter((x) => x !== item) : [...data.equipment, item]);
  }
  return (
    <div>
      <StepTitle title="Equipment & experience" />
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>What do you have available?</Label>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT.map((e) => {
              const sel = data.equipment.includes(e);
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => toggle(e)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-left transition-all",
                    sel ? "border-primary bg-primary/5" : "hover:bg-accent/5",
                  )}
                >
                  <Checkbox checked={sel} className="pointer-events-none" />
                  {e}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Fitness experience</Label>
          <div className="grid grid-cols-3 gap-2">
            {EXPERIENCES.map((e) => (
              <Pill key={e} value={e} selected={data.experience === e} onSelect={() => update("experience", e)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHealth({ data, update }: StepProps) {
  return (
    <div>
      <StepTitle title="Health check" desc="Optional — helps us keep your plan safe." />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conditions">Medical conditions</Label>
          <Textarea id="conditions" placeholder="e.g. hypertension, diabetes, knee pain" value={data.conditions} onChange={(e) => update("conditions", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disabilities">Disabilities or mobility limits</Label>
          <Textarea id="disabilities" placeholder="Anything we should adapt for" value={data.disabilities} onChange={(e) => update("disabilities", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function StepNutrition({ data, update }: StepProps) {
  return (
    <div>
      <StepTitle title="Nutrition preferences" />
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Food preference</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FOOD_PREFS.map((f) => (
              <Pill key={f} value={f} selected={data.foodPreference === f} onSelect={() => update("foodPreference", f)} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input id="allergies" placeholder="e.g. peanuts, dairy" value={data.allergies} onChange={(e) => update("allergies", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Weekly food budget</Label>
          <div className="grid grid-cols-3 gap-2">
            {BUDGETS.map((b) => (
              <Pill key={b} value={b} selected={data.budget === b} onSelect={() => update("budget", b)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSummary({ data, isSenior }: { data: OnboardingData; isSenior: boolean }) {
  const rows = [
    ["Name", data.name || "—"],
    ["Age", data.age || "—"],
    ["Goal", data.goal || "—"],
    ["Mode", data.mode || "—"],
    ["Experience", data.experience || "—"],
    ["Food", data.foodPreference || "—"],
  ];
  const metrics = [
    { label: "BMI", value: "—", hint: "Calculated in next phase" },
    { label: "BMR", value: "— kcal", hint: "Calculated in next phase" },
    { label: "Calories", value: "— kcal", hint: "Daily target" },
    { label: "Protein", value: "— g", hint: "Daily target" },
    { label: "Water", value: "— L", hint: "Daily target" },
  ];
  return (
    <div>
      <StepTitle title="You're all set" desc="Here's a preview of your profile. AI plan generation coming in the next phase." />
      {isSenior && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">
          <HeartPulse className="mt-0.5 h-4 w-4 text-accent" />
          <p><span className="font-medium">Senior Fitness Mode</span> is enabled for a safer, gentler progression.</p>
        </div>
      )}
      <div className="grid gap-2 rounded-xl border p-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-base font-bold">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pill({ value, selected, onSelect }: { value: string; selected: boolean; onSelect: () => void }) {
  return (
    <label
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
        selected ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent/5",
      )}
    >
      <RadioGroupItem value={value} className="sr-only" />
      {value}
    </label>
  );
}
