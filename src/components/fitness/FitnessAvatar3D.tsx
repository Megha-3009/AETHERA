
import { Suspense, useMemo, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { clone } from "three/addons/utils/SkeletonUtils.js";

function RealisticFitnessModel({
  squatTrigger,
}: {
  squatTrigger: number;
}) {
  const character = useLoader(
    FBXLoader,
    "/models/mixamo-character.fbx"
  );

  const animationFBX = useLoader(
    FBXLoader,
    "/models/SquatAnimation.fbx"
  );

  const model = useMemo(() => clone(character), [character]);

  const mixer = useMemo(
    () => new THREE.AnimationMixer(model),
    [model]
  );

  const action = useMemo(() => {
    const sourceClip = animationFBX.animations.find(
      (animation) => animation.duration > 0
    );

    if (!sourceClip) {
      console.error("No animation clip found in SquatAnimation.fbx");
      return null;
    }

    const clip = sourceClip.clone();

    clip.tracks = clip.tracks
      .map((sourceTrack) => {
        const track = sourceTrack.clone();
        track.name = track.name.replace(
          /^mixamorig(?=[A-Z])/,
          "mixamorig2"
        );
        return track;
      })
      .filter((track) =>
        model.getObjectByName(track.name.split(".")[0])
      );

    console.log(
      "Retargeted animation tracks:",
      clip.tracks.length,
      "of",
      sourceClip.tracks.length
    );

    return mixer.clipAction(clip);
  }, [animationFBX, mixer, model]);

  useEffect(() => {
    if (!action || squatTrigger === 0) return;

    action.stop();
    action.reset();
    action.enabled = true;
    action.paused = false;
    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce, 1);
    action.timeScale = 1;
    action.time = 0;
    action.play();

    mixer.update(0);
  }, [squatTrigger, action, mixer]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return <primitive object={model} />;
}

export function FitnessAvatar3D() {
  const [squatTrigger, setSquatTrigger] = useState(0);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="font-semibold">AETHERA 3D Fitness Avatar</h3>
          <p className="text-xs text-muted-foreground">
            Drag to rotate · Scroll to zoom
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
          3D Preview
        </span>
      </div>

      <div className="h-[420px] w-full">
        <Canvas camera={{ position: [0, 1, 4], fov: 45 }} dpr={[1, 1.5]}>
          <color attach="background" args={["#11111b"]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 4]} intensity={2} castShadow />
          <pointLight position={[-3, 2, -2]} color="#8b5cf6" intensity={5} />

          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.3}>
              <RealisticFitnessModel squatTrigger={squatTrigger} />
            </Bounds>
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={4}
              blur={2}
            />
            <Environment preset="studio" />
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={1}
            maxDistance={8}
          />
        </Canvas>
      </div>

      <div className="flex justify-center gap-3 px-4 py-3">
        <button
          onClick={() => setSquatTrigger((n) => n + 1)}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Squat
        </button>
      </div>
    </div>
  );
}

export default FitnessAvatar3D;
