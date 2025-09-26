"use client";
import React, { useState, useRef } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Stage, Layer, Rect, Text } from "react-konva";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

import walkAnim from "@/animations/walk.json";
import danceAnim from "@/animations/dance.json";
import waveAnim from "@/animations/wave.json";
import { useRouter } from "next/navigation";


const animations: Record<string, any> = {
  Walk: walkAnim,
  Wave: waveAnim,
  Dance: danceAnim
};

interface TimelineBlock {
  id: string;
  action: string;
  x: number;
  y: number;
}

const CardLayout: React.FC = () => {
  const [blocks, setBlocks] = useState<TimelineBlock[]>([]);
  const [currentAnim, setCurrentAnim] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const router = useRouter();



  // Add a block
  const addBlock = (action: string) => {
    const newBlock: TimelineBlock = {
      id: `${action}-${Date.now()}`,
      action,
      x: blocks.length * 120,
      y: 10,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setCurrentAnim(action);
  };

  // Play timeline in order of X position
  const playTimeline = async () => {
    if (blocks.length === 0) return;
    setIsPlaying(true);

    // Sort by horizontal position (x)
    const sortedBlocks = [...blocks].sort((a, b) => a.x - b.x);

    for (const block of sortedBlocks) {
      if (!animations[block.action]) continue;

      setCurrentAnim(block.action);

      // Restart animation
      lottieRef.current?.stop();
      lottieRef.current?.play();

      // Wait until animation finishes (approximation)
      await new Promise<void>((resolve) => {
        const duration = lottieRef.current?.getDuration(true) || 1000;
        setTimeout(resolve, duration);
      });

      if (!isPlaying) break; // stop if user cancelled
    }

    setIsPlaying(false);
  };

  const stopTimeline = () => {
    setIsPlaying(false);
    lottieRef.current?.stop();
  };

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen lg:min-h-[90vh] bg-gray-100 px-2 sm:px-4">
        <div className="w-full max-w-5xl border-2 border-black rounded-xl shadow-lg bg-grey p-4 sm:p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 text-sm sm:text-lg">

            <button
  onClick={() => router.push("/screens/animation")}
  className="text-gray-800 hover:underline"
>
  ← Back to Animations
</button>



            <button className="text-gray-800 hover:underline">Export</button>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-10">
            Character Generator
          </h2>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* Buttons (left) on large screens */}
            <div className="hidden lg:flex flex-col gap-4 w-1/4">
              {["Walk", "Wave", "Dance"].map((action) => (
                <button
                  key={action}
                  onClick={() => addBlock(action)}
                  className="px-4 py-3 border rounded-lg bg-gray-300 hover:bg-gray-200 text-base font-medium"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Character Card */}
            <div className="flex-1 border rounded-lg flex flex-col items-center justify-center text-gray-600 min-h-[200px] lg:min-h-[250px]">
              <p className="mb-3 font-medium text-lg">Viera</p>
              {currentAnim && animations[currentAnim] ? (
                <Lottie
                  lottieRef={lottieRef}
                  animationData={animations[currentAnim]}
                  loop={false}
                  autoplay={false}
                  className="w-32 h-32 sm:w-40 sm:h-40"
                />
              ) : (
                <span className="text-5xl sm:text-6xl">✕</span>
              )}
            </div>
          </div>

          {/* Buttons (bottom) on small screens */}
          <div className="flex lg:hidden flex-row justify-between gap-3 mt-4">
            {["Walk", "Wave", "Dance"].map((action) => (
              <button
                key={action}
                onClick={() => addBlock(action)}
                className="flex-1 px-3 py-2 border rounded-lg bg-gray-300 hover:bg-gray-200 text-sm font-medium"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="mt-8 sm:mt-10 w-full border rounded-lg bg-gray-50 p-4 overflow-x-auto">
            <p className="font-medium mb-2">Timeline</p>
            <div className="min-w-[600px]">
              <Stage width={Math.max(blocks.length * 120, 600)} height={100}>
                <Layer>
                  {blocks.map((block) => (
                    <React.Fragment key={block.id}>
                      <Rect
                        x={block.x}
                        y={block.y}
                        width={100}
                        height={50}
                        fill="#3b82f6"
                        draggable
                        onDragEnd={(e) => {
                          const newBlocks = blocks.map((b) =>
                            b.id === block.id
                              ? { ...b, x: e.target.x(), y: e.target.y() }
                              : b
                          );
                          setBlocks(newBlocks);
                        }}
                        onClick={() => setCurrentAnim(block.action)}
                      />
                      <Text
                        text={block.action}
                        x={block.x + 20}
                        y={block.y + 15}
                        fontSize={14}
                        fill="white"
                      />
                    </React.Fragment>
                  ))}
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Playback controls */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={isPlaying ? stopTimeline : playTimeline}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {isPlaying ? "Stop" : "Play Timeline"}
            </button>
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
              Customize & Animate
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CardLayout;
