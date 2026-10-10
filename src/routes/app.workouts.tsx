
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initializePoseLandmarker } from "@/lib/pose";
import { calculateAngle } from "@/lib/angles";
import {
  Camera,
  CircleStop,
  Loader2,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/app/workouts")({
  component: WorkoutsPage,
});

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  [11, 12],
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
  [18, 20],
  [11, 23], [12, 24], [23, 24],
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
];

function WorkoutsPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detected, setDetected] = useState(false);
  const [kneeAngles, setKneeAngles] = useState({
  left: 0,
  right: 0,
});
const [reps, setReps] = useState(0);
const [formFeedback, setFormFeedback] = useState(
  "Waiting for squat analysis..."
);
const [alignmentFeedback, setAlignmentFeedback] = useState(
  "Knee alignment not assessed yet."
);
const [exerciseFeedback, setExerciseFeedback] = useState(
  "Position your full body in the camera view."
);

const squatPhaseRef = useRef<"standing" | "squatting">("standing");
const lastRepTimeRef = useRef(0);
const REP_COOLDOWN_MS = 1000;

  async function startCamera() {
    try {
      setLoading(true);
      setError("");
      setDetected(false);
      setReps(0);
squatPhaseRef.current = "standing";
lastRepTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        throw new Error("Video or canvas element not found.");
      }

      video.srcObject = stream;
      await video.play();

      const poseLandmarker = await initializePoseLandmarker();

      setCameraActive(true);
      setLoading(false);

     const context = canvas.getContext("2d");

if (!context) {
  throw new Error("Unable to create canvas drawing context.");
}

const ctx: CanvasRenderingContext2D = context;
      let lastDetectionTime = -1;

      
function detectPose() {
  if (
    !video ||
    !canvas ||
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
  ) {
    animationRef.current = requestAnimationFrame(detectPose);
    return;
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    animationRef.current = requestAnimationFrame(detectPose);
    return;
  }

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  ctx.clearRect(0, 0, width, height);

  const timestamp = performance.now();

  if (timestamp > lastDetectionTime) {
    lastDetectionTime = timestamp;

    const result = poseLandmarker.detectForVideo(video, timestamp);
    const landmarks = result.landmarks[0];

    if (landmarks) {
      setDetected(true);

      // Calculate knee angles.
      const leftKnee = calculateAngle(
        landmarks[23],
        landmarks[25],
        landmarks[27]
      );

      const rightKnee = calculateAngle(
        landmarks[24],
        landmarks[26],
        landmarks[28]
      );

      setKneeAngles({
        left: leftKnee,
        right: rightKnee,
      });

      // Count squat repetitions.
      
const averageKneeAngle = (leftKnee + rightKnee) / 2;


const leftHip = landmarks[23];
const rightHip = landmarks[24];
const leftKneePoint = landmarks[25];
const rightKneePoint = landmarks[26];
const leftAnkle = landmarks[27];
const rightAnkle = landmarks[28];

const leftKneeInward =
  (leftKneePoint.x - leftHip.x) *
  (leftAnkle.x - leftKneePoint.x) < 0;

const rightKneeInward =
  (rightKneePoint.x - rightHip.x) *
  (rightAnkle.x - rightKneePoint.x) < 0;

const kneeAlignmentWarning =
  leftKneeInward || rightKneeInward;
  setAlignmentFeedback(
  kneeAlignmentWarning
    ? "Check your knee alignment."
    : "No inward movement detected."
);


if (averageKneeAngle > 150) {
  setFormFeedback("Standing position — begin your squat.");
} else if (averageKneeAngle > 115) {
  setFormFeedback("Bend a little deeper if comfortable.");
} else {
  setFormFeedback("Good squat depth!");
}


// Detect the downward movement.
if (
  averageKneeAngle < 115 &&
  squatPhaseRef.current === "standing"
) {
  squatPhaseRef.current = "squatting";
  setExerciseFeedback("Squat detected — now stand up!");
}

// Count one rep when the user stands back up.
else if (
  averageKneeAngle > 150 &&
  squatPhaseRef.current === "squatting"
) {
  squatPhaseRef.current = "standing";
  setReps((prev) => prev + 1);
  setExerciseFeedback("Good rep! Ready for the next squat.");
}

else if (squatPhaseRef.current === "squatting") {
  setExerciseFeedback("Keep going — stand up to complete the rep.");
}
else {
  setExerciseFeedback("Bend your knees to begin the squat.");
}



      // Draw connections between body landmarks.
      ctx.lineWidth = Math.max(3, width / 250);
      ctx.strokeStyle = "#00FF88";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const [start, end] of CONNECTIONS) {
        const a = landmarks[start];
        const b = landmarks[end];

        if (
          !a ||
          !b ||
          (a.visibility ?? 1) < 0.5 ||
          (b.visibility ?? 1) < 0.5
        ) {
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }

      // Draw visible body landmarks.
      for (const point of landmarks) {
        if ((point.visibility ?? 1) < 0.5) continue;

        ctx.beginPath();
        ctx.arc(
          point.x * width,
          point.y * height,
          Math.max(3, width / 180),
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "#00FF88";
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#062E20";
        ctx.stroke();
      }
    } else {
      setDetected(false);
    }
  }

  animationRef.current = requestAnimationFrame(detectPose);
}


      detectPose();
    } catch (err) {
      console.error("POSE DETECTION ERROR:", err);

      setLoading(false);
      setCameraActive(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to start pose detection.");
      }
    }
  }
  function resetReps() {
  setReps(0);
  squatPhaseRef.current = "standing";
  lastRepTimeRef.current = 0;
}

  function stopCamera() {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

    setCameraActive(false);
    setDetected(false);
  }

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Workout Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Track body landmarks in real time using MediaPipe Pose.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
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
          
{cameraActive && (
  <div className="absolute inset-x-0 top-4 z-10 flex justify-between gap-3 px-4">
    <div className="rounded-xl border border-white/20 bg-black/70 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
      <p className="text-xs font-medium text-white/70">
        SQUAT REPS
      </p>
      <p className="text-3xl font-bold tabular-nums">
        {reps}
      </p>
    </div>

    <div className="max-w-[65%] self-start rounded-xl border border-emerald-400/40 bg-black/70 px-4 py-3 text-right text-white shadow-lg backdrop-blur-sm">
      <p className="text-xs font-medium text-emerald-300">
        AI FITNESS COACH
      </p>
      <p className="mt-1 text-sm font-semibold">
        {exerciseFeedback}
      </p>
      
<p className="mt-2 border-t border-white/20 pt-2 text-xs text-emerald-200">
  Form Check: {formFeedback}
</p>
<p className="mt-2 text-xs text-white/90">
  Knee Alignment: {alignmentFeedback}
</p>

    </div>
  </div>
)}


          {!cameraActive && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <Camera className="mb-4 h-12 w-12" />
              <h2 className="text-xl font-bold">
                Start Exercise Analysis
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/70">
                Start the camera to detect your body landmarks.
              </p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="mt-4 text-sm">
                Loading camera and AI pose detection...
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">
              {cameraActive ? "AI Pose Detection Active" : "Camera Analysis"}
            </p>
            <p className="text-sm text-muted-foreground">
              {cameraActive
                ? detected
                  ? "Body detected — live skeleton tracking is active."
                  : "Camera active — position your full body in view."
                : "Start the camera to begin."}
            </p>
          </div>

          {!cameraActive ? (
            <Button onClick={startCamera} disabled={loading}>
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopCamera}>
              <CircleStop className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          )}
        </div>
      </Card>

      {error && (
        <Card className="border-destructive p-5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-lg font-bold">Computer Vision Status</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Pose Detection:</span>{" "}
            {detected ? "Body detected" : cameraActive ? "Searching..." : "Waiting"}
          </p>
         <p>
  <span className="font-medium">Exercise:</span>{" "}
  {detected ? "Squat tracking active" : "Waiting for detection"}
</p>

<p>
  <span className="font-medium">Live Feedback:</span>{" "}
  {exerciseFeedback}
</p>
          <p>
  <span className="font-medium">Repetitions:</span> {reps}
</p>
          <p>
            <span className="font-medium">Form:</span> Not analyzed yet
          </p>
          <p>
  <span className="font-medium">Left Knee Angle:</span>{" "}
  {detected ? `${kneeAngles.left}°` : "--"}
</p>

<p>
  <span className="font-medium">Right Knee Angle:</span>{" "}
  {detected ? `${kneeAngles.right}°` : "--"}
</p>
        </div>
        <Button
  variant="outline"
  onClick={resetReps}
  className="mt-4"
>
  <RotateCcw className="mr-2 h-4 w-4" />
  Reset Repetitions
</Button>
      </Card>
    </div>
  );
}
