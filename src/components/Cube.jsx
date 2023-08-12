import React, { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

export default function Cube() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create the WebGPU engine
    const engine = new BABYLON.WebGPUEngine(canvasRef.current)

    if (!BABYLON.WebGPUEngine.IsSupported) {
      console.error("WebGPU is not supported in this browser.");
      return;
  }
    engine.enableOfflineSupport = false;

    // Create the scene
    const scene = new BABYLON.Scene(engine);
    // Create the camera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      3,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);

    // Create the light
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    // Create the cube
    const cube = BABYLON.MeshBuilder.CreateBox("cube", {}, scene);

    // Add a rotation animation to the cube
    scene.registerBeforeRender(() => {
      cube.rotation.y += 0.01;
      cube.rotation.x += 0.01;
    });

    // Render the scene
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize the engine when the window is resized
    window.addEventListener("resize", () => {
      engine.resize();
    });
  }, []);

  return <canvas ref={canvasRef} />;
}
