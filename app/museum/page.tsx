"use client";

import "../museum.css";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
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

const exhibitions = [
  {
    number: "01",
    name: "The Beginnings",
    description: "Firsts, new chapters, and moments of becoming.",
  },
  {
    number: "02",
    name: "The People",
    description: "The people who made the moments matter.",
  },
  {
    number: "03",
    name: "The Places",
    description: "Places that became part of your story.",
  },
  {
    number: "04",
    name: "Everything In Between",
    description: "The moments that don't fit neatly anywhere.",
  },
];

function ExhibitionView({
    room,
    memories,
    }: {
    room: string;
    memories: Memory[];
    }) {
    const roomMemories = memories.filter(
        (memory) => memory.room === room
    );

    const exhibition = exhibitions.find(
        (item) => item.name === room
    );

    if (!exhibition) {
        return null;
    }

    return (
        <main className="museum exhibition-page">

        <header className="museum-header">

          <Link href="/museum" className="museum-logo">
            MEMENTO
          </Link>

          <div className="museum-header-right">

            <Link
              href="/create"
              className="preserve-link"
            >
              Preserve a memory
            </Link>

            <div className="museum-meta">
              <span>PRIVATE ARCHIVE</span>
              <span>EXHIBITION {exhibition.number}</span>
            </div>

          </div>

        </header>

        <section className="exhibition-intro">

            <Link
            href="/museum"
            className="back-link"
            >
            ← The Museum
            </Link>

            <p className="museum-eyebrow">
            EXHIBITION {exhibition.number}
            </p>

            <h1>
            {exhibition.name}
            </h1>

            <p>
            {exhibition.description}
            </p>

            <span className="exhibition-total">
            {roomMemories.length}{" "}
            {roomMemories.length === 1
                ? "memory"
                : "memories"}
            </span>

        </section>

        <section className="memory-grid">

            {roomMemories.map((memory) => (

            <Link
                key={memory.id}
                href={`/memory/${memory.id}`}
                className="memory-card"
            >

                {memory.image_url && (
                <div className="memory-card-image">
                    <img
                    src={memory.image_url}
                    alt={memory.title}
                    />
                </div>
                )}

                <div className="memory-card-info">

                <span>
                    {memory.memory_date
                    ? new Date(
                        memory.memory_date
                        ).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                        )
                    : "Undated"}
                </span>

                <h2>{memory.title}</h2>

                {memory.description && (
                    <p>{memory.description}</p>
                )}

                </div>

            </Link>

            ))}

        </section>

        {roomMemories.length === 0 && (

            <div className="empty-exhibition">

            <p>
                This room is waiting for its first memory.
            </p>

            <Link href="/create">
                Preserve one →
            </Link>

            </div>

        )}

        </main>
    );
}

export default function MuseumPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const room = searchParams.get("room");

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

  const getRoomCount = (room: string) => {
    return memories.filter((memory) => memory.room === room).length;
  };

  const featuredMemory = memories[0];

  if (loading) {
    return (
      <main className="museum">
        <div className="museum-loading">
          <p>Preparing your museum...</p>
        </div>
      </main>
    );
  }

  if (room) {
    return (
        <ExhibitionView
        room={room}
        memories={memories}
        />
    );
    }

  return (
    <main className="museum">

      {/* HEADER */}

      <header className="museum-header">
        <Link href="/museum" className="museum-logo">
          MEMENTO
        </Link>

        <div className="museum-header-right">

          <Link
            href="/create"
            className="preserve-link"
          >
            Preserve a memory
          </Link>

          <div className="museum-meta">
            <span>PRIVATE ARCHIVE</span>
            <span>THE MUSEUM OF YOU</span>
          </div>

        </div>
      </header>


      {/* INTRO */}

      <section className="museum-intro">

        <p className="museum-eyebrow">
          YOUR COLLECTION
        </p>

        <h1>
          The Museum
          <br />
          <em>of You.</em>
        </h1>

        <p className="museum-description">
          A collection of moments worth remembering.
        </p>

        <div className="museum-stats">

          <div>
            <strong>{memories.length}</strong>
            <span>MEMORIES</span>
          </div>

          <div>
            <strong>04</strong>
            <span>EXHIBITIONS</span>
          </div>

          <div>
            <strong>
              {memories.length > 0
                ? new Date(
                    memories[memories.length - 1].memory_date || ""
                  ).getFullYear()
                : "—"}
            </strong>
            <span>EARLIEST</span>
          </div>

        </div>

      </section>


      {/* EXHIBITIONS */}

      <section className="exhibitions">

        <div className="section-heading">
          <h2>Exhibitions</h2>
        </div>

        <div className="exhibition-list">

          {exhibitions.map((exhibition) => (

            <Link
                key={exhibition.name}
                href={`/museum?room=${encodeURIComponent(exhibition.name)}`}
                className="exhibition"
                >
                <span className="exhibition-number">
                    {exhibition.number}
                </span>

                <div className="exhibition-info">
                    <h3>{exhibition.name}</h3>

                    <p>{exhibition.description}</p>
                </div>

                <span className="exhibition-count">
                    {String(
                    getRoomCount(exhibition.name)
                    ).padStart(2, "0")}
                </span>

                <span className="exhibition-arrow">
                    →
                </span>
            </Link>

          ))}

        </div>

      </section>


      {/* FEATURED MEMORY */}

      {featuredMemory && (

        <section className="featured">

          <div className="section-heading">
            <h2>Recently Preserved</h2>
          </div>

          <div className="featured-memory">

            {featuredMemory.image_url && (

              <div className="featured-image-wrapper">

                <img
                  src={featuredMemory.image_url}
                  alt={featuredMemory.title}
                  className="featured-image"
                />

              </div>

            )}

            <div className="featured-info">

              <p className="featured-room">
                {featuredMemory.room || "UNCURATED"}
              </p>

              <h2>
                {featuredMemory.title}
              </h2>

              {featuredMemory.memory_date && (

                <p className="featured-date">
                  {new Date(
                    featuredMemory.memory_date
                  ).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>

              )}

              {featuredMemory.curator_script && (

                <p className="featured-script">
                  {featuredMemory.curator_script}
                </p>

              )}

              <button className="view-memory">
                View memory →
              </button>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}