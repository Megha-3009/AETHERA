
import { NodeIO } from "@gltf-transform/core";

const io = new NodeIO();
const document = await io.read("public/models/model.glb");

const root = document.getRoot();

console.log("\n--- AETHERA SKELETON BONES ---");

for (const skin of root.listSkins()) {
  console.log("\nSkeleton:", skin.getName() || "(unnamed)");

  for (const joint of skin.listJoints()) {
    console.log(
      joint.getName() || "(unnamed bone)",
      "| Position:",
      joint.getTranslation()
    );
  }
}



const hips = document.getRoot()
  .listNodes()
  .find((node) => node.getName() === "Hips");

console.log("Hips node:", hips?.getName());

if (hips) {
  console.log(
    "Hips children:",
    hips.listChildren().map((node) => node.getName())
  );

  console.log(
    "Hips parent:",
    document.getRoot()
      .listNodes()
      .find((node) => node.listChildren().includes(hips))
      ?.getName() ?? "No parent found"
  );
}

