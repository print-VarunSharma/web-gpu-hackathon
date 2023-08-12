"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";
interface ParticleData {
  id: number;
  description: string;
  from: number;
  to: number;
  group: string;
  position: { x: number; y: number; z: number };
  color: { r: number; g: number; b: number };
}

interface ParticleGroup {
  name: string;
  colour: { r: number; g: number; b: number };
}

const PointsRenderer: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const groups: ParticleGroup[] = [
    {
      name: "Group 1",
      colour: { r: 255, g: 0, b: 0 },
    },
    {
      name: "Group 2",
      colour: { r: 0, g: 255, b: 0 },
    },
    {
      name: "Group 3",
      colour: { r: 0, g: 0, b: 255 },
    },
    {
      name: "Group 4",
      colour: { r: 255, g: 255, b: 0 },
    },
    {
      name: "Group 5",
      colour: { r: 255, g: 0, b: 255 },
    },
    {
      name: "Group 6",
      colour: { r: 0, g: 255, b: 255 },
    },
    {
      name: "Group 7",
      colour: { r: 128, g: 128, b: 128 },
    },
  ];

  const generateData = (num: number): ParticleData[] => {
    const data: ParticleData[] = [];
    const n = 1400;
    const n2 = n / 2;
    const color = new THREE.Color();

    const groupCenters: {
      [key: string]: { x: number; y: number; z: number };
    } = {};
    groups.forEach((group) => {
      groupCenters[group.name] = {
        x: Math.random() * n - n2,
        y: Math.random() * n - n2,
        z: Math.random() * n - n2,
      };
    });

    for (let i = 0; i < num; i++) {
      const from = Math.floor(Math.random() * num);
      const to = Math.floor(Math.random() * num);

      const group = groups[Math.floor(Math.random() * groups.length)];

      const groupCenter = groupCenters[group.name];
      const radius = 100;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = groupCenter.x + radius * Math.sin(phi) * Math.cos(theta);
      const y = groupCenter.y + radius * Math.sin(phi) * Math.sin(theta);
      const z = groupCenter.z + radius * Math.cos(phi);

      color.setRGB(
        group.colour.r / 255,
        group.colour.g / 255,
        group.colour.b / 255
      );

      data.push({
        id: i,
        description: `Particle ${i}`,
        from: from,
        to: to,
        group: group.name,
        position: { x, y, z },
        color: { r: color.r, g: color.g, b: color.b },
      });
    }

    return data;
  };
  useEffect(() => {
    if (!canvasRef.current) return;
    const { offsetWidth: width, offsetHeight: height } = canvasRef.current;

    const camera = new THREE.PerspectiveCamera(27, width / height, 5, 1000000);
    camera.position.z = 2750;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const renderer = new WebGPURenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const particles = 1000;
    const data = generateData(particles); // Generate the data
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial();
    const boxes = new THREE.InstancedMesh(boxGeometry, boxMaterial, particles);

    for (let i = 0; i < data.length; i++) {
      const { position, color } = data[i];
      const matrix = new THREE.Matrix4();
      matrix.setPosition(position.x, position.y, position.z);
      boxes.setMatrixAt(i, matrix);
      boxes.setColorAt(i, new THREE.Color(color.r, color.g, color.b));
    }

    scene.add(boxes);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PointsRenderer;
