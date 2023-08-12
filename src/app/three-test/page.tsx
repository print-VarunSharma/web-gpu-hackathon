"use client";
import React from "react";
import dynamic from "next/dynamic";

const DynamicThreeScene = dynamic(() => import("@/components/ThreeScene"), {
  loading: () => <p>Loading...</p>, // You can customize the loading message
});

export default function Home() {
  return (
    <>
      <h1>Hello Mehdis movies</h1>
      <DynamicThreeScene />
    </>
  );
}
