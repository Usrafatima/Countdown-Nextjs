"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle changes in duration input field
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Manage countdown interval
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]); // Dependencies array to rerun effect

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`; // Return formatted string
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark: bg-gray-600 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Countdown Timer</h1>
        <div className="flex items-center mb-6">
          <input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            onClick={handleSetDuration}
            className="text-gray-800 dark:text-gray-200"
          >
            Set
          </button>
        </div>
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={handleStart} className="text-gray-800 dark:text-gray-200">
            {isPaused ? "Resume" : "Start"}
          </button>
          <button onClick={handlePause} className="text-gray-800 dark:text-gray-200">
            Pause
          </button>
          <button onClick={handleReset} className="text-gray-800 dark:text-gray-200">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
