"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./memory.css";

type Memory = {
  id: string;
  title: string;
  description: string | null;
  memory_date: string | null;
  image_url: string | null;
  room: string | null;
  themes: string[] | null;
  curator_script: string | null;
  audio_url: string | null;
};

export default function MemoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemory() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
      }

      setMemory(data);
      setLoading(false);
    }

    if (id) {
      fetchMemory();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="memory-loading">
        <p>Entering the exhibit...</p>
      </main>
    );
  }

  if (!memory) {
    return (
      <main className="memory-loading">
        <div>
          <p>This memory could not be found.</p>

          <Link href="/museum">
            Return to the museum →
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = memory.memory_date
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
        }).format(new Date(`${memory.memory_date}T00:00:00Z`))
    : "Date unknown";

  return (
    <main className="memory-exhibit">

      {/* HEADER */}

      <header className="memory-header">

        <Link href="/museum" className="memory-logo">
          MEMENTO
        </Link>

        <Link
          href={
            memory.room
              ? `/museum?room=${encodeURIComponent(memory.room)}`
              : "/museum"
          }
          className="memory-back"
        >
          ← {memory.room || "The Museum"}
        </Link>

      </header>


      {/* TITLE */}

      <section className="memory-intro">

        <div>

          <p className="memory-eyebrow">
            {memory.room || "PRIVATE COLLECTION"}
          </p>

          <h1>{memory.title}</h1>

          <p className="memory-date">
            {formattedDate}
          </p>

        </div>

      </section>


      {/* IMAGE */}

      {memory.image_url && (
        <section className="memory-image-section">

          <img
            src={memory.image_url}
            alt={memory.title}
            className="memory-main-image"
          />

        </section>
      )}


      {/* DETAILS */}

      <section className="memory-details">

        <div className="memory-description">

          <span className="detail-label">
            THE MEMORY
          </span>

          <p>
            {memory.description ||
              "A moment preserved in the archive."}
          </p>

        </div>


        <div className="curator-section">

          <span className="detail-label">
            THE CURATOR'S NOTE
          </span>

          <p className="curator-text">
            {memory.curator_script ||
              "The curator has not written a note for this memory yet."}
          </p>

          <div className="memory-audio">

            <button
              type="button"
              disabled
              className="audio-button"
            >
              <span>▶</span>
              Listen to the curator
            </button>

            <p>
              Curator narration coming soon.
            </p>

          </div>

        </div>


        {memory.themes &&
          memory.themes.length > 0 && (

          <div className="memory-themes">

            <span className="detail-label">
              THEMES
            </span>

            <div className="theme-list">

              {memory.themes.map((theme) => (
                <span
                  key={theme}
                  className="theme"
                >
                  {theme}
                </span>
              ))}

            </div>

          </div>

        )}


      </section>


      {/* FOOTER */}

      <footer className="memory-footer">

        <Link
          href={
            memory.room
              ? `/museum?room=${encodeURIComponent(memory.room)}`
              : "/museum"
          }
        >
          Return to exhibition →
        </Link>

      </footer>

    </main>
  );
}