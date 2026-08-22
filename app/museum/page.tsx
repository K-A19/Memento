"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Memory = {
  id: string;
  title: string;
  description: string | null;
  memory_date: string | null;
  image_url: string | null;
  room: string | null;
  themes: string[] | null;
  curator_script: string | null;
};

export default function MuseumPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("memory_date", { ascending: false });

      if (error) {
        console.error("Error loading memories:", error);
      } else {
        setMemories(data || []);
      }

      setLoading(false);
    }

    loadMemories();
  }, []);

  if (loading) {
    return (
      <main className="museum-page">
        <p>Preparing your exhibition...</p>
      </main>
    );
  }

  return (
    <main className="museum-page">
      <header className="museum-header">
        <p className="eyebrow">MEMENTO</p>

        <h1>Your Museum</h1>

        <p className="museum-subtitle">
          A collection of moments worth remembering.
        </p>
      </header>

      <section className="museum-grid">
        {memories.map((memory) => (
          <article key={memory.id} className="memory-card">
            {memory.image_url && (
              <img
                src={memory.image_url}
                alt={memory.title}
                className="memory-image"
              />
            )}

            <div className="memory-content">
              <p className="memory-room">
                {memory.room || "Uncurated"}
              </p>

              <h2>{memory.title}</h2>

              {memory.memory_date && (
                <p className="memory-date">
                  {new Date(memory.memory_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              )}

              {memory.themes && memory.themes.length > 0 && (
                <div className="memory-themes">
                  {memory.themes.map((theme) => (
                    <span key={theme}>{theme}</span>
                  ))}
                </div>
              )}

              {memory.curator_script && (
                <p className="curator-script">
                  {memory.curator_script}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      {memories.length === 0 && (
        <div className="empty-museum">
          <h2>Your museum is waiting.</h2>
          <p>Create your first memory to begin your collection.</p>
        </div>
      )}
    </main>
  );
}