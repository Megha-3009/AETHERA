import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { mockAuth } from "@/lib/mock-auth";

export const Route = createFileRoute("/verify-email")({
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await mockAuth.verifyEmail(code);
      toast.success("Email verified — let's set you up");
      navigate({ to: "/onboarding" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Verify your email" subtitle="Enter the 6-digit code we sent to your inbox">
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="h-7 w-7" />
        </div>
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" disabled={loading || code.length !== 6} className="w-full bg-gradient-primary text-white hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & continue"}
        </Button>
        <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          Didn't receive it? Resend code
        </button>
      </form>
    </AuthShell>
  );
}
