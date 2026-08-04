"use client";

import dynamic from "next/dynamic";
import type { Application } from "@splinetool/runtime";
import { improveRobotVisibility } from "@/lib/spline-visibility.mjs";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  ),
});

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  function handleLoad(spline: Application) {
    improveRobotVisibility(spline);
  }

  return <Spline scene={scene} className={className} onLoad={handleLoad} />;
}
