
import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { clone } from "three/addons/utils/SkeletonUtils.js";


function RealisticFitnessModel({
  isSquatting,
}: {
  isSquatting: boolean;
}) {
  const character = useLoader(
    FBXLoader,
    "/models/mixamo-character.fbx"
  );

  const animationFBX = useLoader(
    FBXLoader,
    "/models/SquatAnimation.fbx"
  );

  useEffect(() => {
  console.log(
  "CHARACTER BONES:",
  model.children.map((child) => child.name)
);

console.log(
  "ANIMATION TRACKS:",
  animationFBX.animations[0]?.tracks
    .slice(0, 20)
    .map((track) => track.name)
);
}, [animationFBX]);

  const model = useMemo(
    () => clone(character),
    [character]
  );

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
    .map((track) => {
      track = track.clone();

      track.name = track.name.replace(
        /^mixamorig(?=[A-Z])/,
        "mixamorig2"
      );

      return track;
    })
    .filter((track) => model.getObjectByName(
      track.name.split(".")[0]
    ));

  console.log(
    "Retargeted animation tracks:",
    clip.tracks.length,
    "of",
    sourceClip.tracks.length
  );

  return mixer.clipAction(clip);
}, [animationFBX, mixer, model]);


  
useEffect(() => {
  if (!action) return;

  action.stop();
  action.reset();
  action.enabled = true;
  action.paused = false;
  action.clampWhenFinished = true;
  action.setLoop(THREE.LoopOnce, 1);

  if (isSquatting) {
    action.timeScale = 1;
    action.time = 0;
    action.play();
  } else {
    action.timeScale = -1;
    action.time = action.getClip().duration;
    action.play();
  }
}, [isSquatting, action]);


 
useEffect(() => {
  if (!action) return;

  action.stop();
  action.reset();
  action.enabled = true;
  action.paused = false;
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true;

  const duration = action.getClip().duration;

  if (isSquatting) {
    action.timeScale = 1;
    action.time = 0;
  } else {
    action.timeScale = -1;
    action.time = duration;
  }

  action.play();
  mixer.update(0);
}, [isSquatting, action, mixer]);


  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return <primitive object={model} />;
}


export function FitnessAvatar3D() {
  const [isSquatting, setIsSquatting] = useState(false);

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
              <RealisticFitnessModel isSquatting={isSquatting} />
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
          onClick={() => setIsSquatting(false)}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Stand
        </button>
        <button
          onClick={() => setIsSquatting(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Squat
        </button>
      </div>
    </div>
  );
}

export default FitnessAvatar3D;
