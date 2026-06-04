"use client";

import { useState } from "react";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [mask, setMask] = useState(3); // default mask
  const [response, setResponse] = useState("");

  async function submitPost() {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          mask,
        }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Network error — request blocked by browser.");
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Post</h1>

      <textarea
        className="w-full border p-3 rounded mb-4"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your post here..."
      />

      <div className="mb-4">
        <label className="font-semibold mr-2">Mask:</label>
        <select
          value={mask}
          onChange={(e) => setMask(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={1}>1 — Dark Whisper</option>
          <option value={2}>2 — Fierce Awakener</option>
          <option value={3}>3 — Neutral Mask</option>
          <option value={4}>4 — Bright Mask</option>
          <option value={5}>5 — Radiant Mask</option>
        </select>
      </div>

      <button
        onClick={submitPost}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Backend Response:</h2>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}
