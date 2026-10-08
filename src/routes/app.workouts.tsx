import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, CircleStop, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initializePoseLandmarker } from "@/lib/pose";

export const Route = createFileRoute("/app/workouts")({
  component: WorkoutsPage,
});

function WorkoutsPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCamera() {
  try {
    setLoading(true);
    setError("");

    console.log("1. Requesting camera...");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    console.log("2. Camera started:", stream);

    streamRef.current = stream;

    const video = videoRef.current;

    if (!video) {
      throw new Error("Video element not found.");
    }

    video.srcObject = stream;

    await video.play();
    try {
  const poseLandmarker = await initializePoseLandmarker();

  console.log("MediaPipe initialized successfully:", poseLandmarker);
} catch (error) {
  console.error("MEDIAPIPE ERROR:", error);
  throw new Error("MediaPipe initialization failed. Check browser console.");
}

    console.log("3. Video playing successfully");

    setCameraActive(true);
    setLoading(false);

  } catch (error) {
    console.error("CAMERA ERROR:", error);

    setLoading(false);
    setCameraActive(false);

    if (error instanceof DOMException) {
      setError(`Camera error: ${error.name} - ${error.message}`);
    } else {
      setError(`Camera error: ${String(error)}`);
    }
  }
}

  function stopCamera() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraActive(false);
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Workout Analysis</h1>

        <p className="mt-2 text-muted-foreground">
          Use your camera to analyze exercise movement with AI.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />

          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />

          {!cameraActive && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <Camera className="mb-4 h-12 w-12" />

              <h2 className="text-xl font-bold">
                Start Exercise Analysis
              </h2>

              <p className="mt-2 max-w-md text-sm text-white/70">
                Allow camera access to detect your body position
                and analyze your exercise movement.
              </p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Loader2 className="h-10 w-10 animate-spin" />

              <p className="mt-4 text-sm">
                Starting AI pose detection...
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">
              {cameraActive
                ? "AI Pose Detection Active"
                : "Camera Analysis"}
            </p>

            <p className="text-sm text-muted-foreground">
              {cameraActive
                ? "Your body landmarks are being detected."
                : "Start the camera to begin."}
            </p>
          </div>

          {!cameraActive ? (
            <Button
              onClick={startCamera}
              disabled={loading}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopCamera}
            >
              <CircleStop className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          )}
        </div>
      </Card>

      {error && (
        <Card className="border-destructive p-5">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-lg font-bold">
          Computer Vision Status
        </h2>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Pose Detection:</span>{" "}
            {cameraActive ? "Active" : "Waiting"}
          </p>

          <p>
            <span className="font-medium">Exercise:</span>{" "}
            Not detected yet
          </p>

          <p>
            <span className="font-medium">Repetitions:</span>{" "}
            0
          </p>

          <p>
            <span className="font-medium">Form:</span>{" "}
            Waiting for movement
          </p>
        </div>
      </Card>
    </div>
  );
}