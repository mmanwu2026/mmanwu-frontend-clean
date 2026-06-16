"use client";

import { useState, useRef } from "react";

export default function SoundSquare() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const masks = [
    { id: 1, label: "Dark Whisper", emoji: "😶‍🌫️" },
    { id: 2, label: "Fierce Awakener", emoji: "🔥" },
    { id: 3, label: "Joyful Spirit", emoji: "😄" },
    { id: 4, label: "Cosmic Dancer", emoji: "🌌" },
    { id: 5, label: "Eternal Radiance", emoji: "✨" },
  ];

  function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setAudioURL(URL.createObjectURL(file));
  }

  function playAudio() {
    audioRef.current?.play();
  }

  function pauseAudio() {
    audioRef.current?.pause();
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">Sound Square</h1>

      {/* Upload Section */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-xl mb-8">
        <label className="block mb-2 text-lg font-semibold">
          Upload your sound
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="w-full p-2 rounded bg-gray-700"
        />

        {audioURL && (
          <audio ref={audioRef} src={audioURL} className="mt-4 w-full" controls />
        )}
      </div>

      {/* Waveform Placeholder */}
      <div className="w-full max-w-2xl h-32 bg-gray-700 rounded-lg mb-8 flex items-center justify-center text-gray-400">
        Waveform will appear here
      </div>

      {/* Masks Row */}
      <div className="flex gap-6 mb-8">
        {masks.map((mask) => (
          <div
            key={mask.id}
            className="flex flex-col items-center cursor-pointer hover:scale-110 transition"
          >
            <div className="text-5xl">{mask.emoji}</div>
            <p className="mt-2 text-sm text-gray-300">{mask.label}</p>
          </div>
        ))}
      </div>

      {/* Audio Controls */}
      <div className="flex gap-4">
        <button
          onClick={playAudio}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Play
        </button>
        <button
          onClick={pauseAudio}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
        >
          Pause
        </button>
      </div>
    </div>
  );
}
