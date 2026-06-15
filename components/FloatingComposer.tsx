"use client";

import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useUser } from "@/context/UserContext";

export default function FloatingComposer({
  onPost,
}: {
  onPost: (post: any) => void;
}) {
  const { user, loading } = useUser();

  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScroll = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY;
      if (current > lastScroll.current + 10) setHidden(true);
      else if (current < lastScroll.current - 10) setHidden(false);
      lastScroll.current = current;
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function submitPost() {
    if (!content.trim()) return;
    if (loading || !user) return;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        content,
        creator_id: user.id,
        mask: 0, // default mask
      })
      .select()
      .single();

    if (error) {
      alert(error.message || "Error creating post");
      return;
    }

    setContent("");
    setExpanded(false);

    if (data) onPost(data);
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 w-full px-4 pb-4 z-50 transition-all duration-300
        ${hidden ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div
        className={`
          bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10
          shadow-lg transition-all duration-300 mx-auto max-w-md
          ${expanded ? "p-4" : "p-3"}
        `}
      >
        {!expanded && (
          <div
            className="flex items-center justify-between text-gray-300"
            onClick={() => setExpanded(true)}
          >
            <span>Write something…</span>
            <span className="text-xl">✍🏽</span>
          </div>
        )}

        {expanded && (
          <div className="flex flex-col space-y-3">
            <textarea
              className="
                w-full rounded-xl p-3 resize-none
                bg-black/30 text-gray-200 placeholder-gray-400
                border border-white/10 focus:outline-none
                focus:ring-2 focus:ring-purple-500/40
              "
              rows={4}
              placeholder="Share your thoughts…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              onClick={submitPost}
              disabled={!content.trim() || loading || !user}
              className={`
                w-full py-2 rounded-xl font-semibold text-white
                transition-all
                ${
                  content.trim() && user
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-900/40 text-gray-400"
                }
              `}
            >
              Post
            </button>

            <button
              className="text-sm text-gray-400 hover:text-gray-300"
              onClick={() => setExpanded(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
