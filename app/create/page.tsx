"use client";

import "../create.css";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!image || !title) {
        setMessage("Please add a photo and title.");
        return;
    }

    setLoading(true);
    setMessage("");

    try {
        // 1. Upload image
        const fileExtension = image.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
        .from("memories")
        .upload(fileName, image);

        if (uploadError) {
        throw uploadError;
        }

        // 2. Get public image URL
        const {
        data: { publicUrl },
        } = supabase.storage
        .from("memories")
        .getPublicUrl(fileName);

        // 3. Create memory and get the new row back
        const { data: memory, error: insertError } = await supabase
        .from("memories")
        .insert({
            title,
            description,
            memory_date: date || null,
            image_url: publicUrl,
        })
        .select()
        .single();

        if (insertError) {
        throw insertError;
        }

        // 4. Trigger Memento's AI curator
        const n8nResponse = await fetch(
        "https://kami23.app.n8n.cloud/webhook/memento-memory",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            memory_id: memory.id,
            title: memory.title,
            description: memory.description,
            date: memory.memory_date,
            }),
        }
        );

        if (!n8nResponse.ok) {
        throw new Error("Failed to trigger AI curator.");
        }

        // 5. Reset form
        setMessage("Memory added to your archive ✨");

        setTitle("");
        setDescription("");
        setDate("");
        setImage(null);

        const fileInput = document.getElementById(
        "image"
        ) as HTMLInputElement;

        if (fileInput) {
        fileInput.value = "";
        }
    } catch (error) {
        console.error(error);
        setMessage("Something went wrong. Check the console.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0c] text-[#f2efe8] px-6 py-16">
      <div className="max-w-2xl mx-auto">

        <p className="text-sm tracking-[0.35em] uppercase text-[#a9a398]">
          Memento
        </p>

        <h1 className="mt-4 text-5xl font-serif">
          Add a memory.
        </h1>

        <p className="mt-4 text-[#a9a398]">
          Give a moment a place in your archive.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">

          <div>
            <label className="block mb-3 text-sm">
              Photograph
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
              className="block w-full text-sm text-[#a9a398]"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summer at the beach"
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-b border-white/20 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm">
              Tell us about this moment
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you remember?"
              rows={5}
              className="w-full bg-transparent border border-white/20 p-4 rounded-lg outline-none focus:border-white transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#f2efe8] text-[#0d0d0c] hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Preserving your memory..."
              : "Add to my exhibition"}
          </button>

          {message && (
            <p className="text-center text-sm text-[#a9a398]">
              {message}
            </p>
          )}

        </form>
      </div>
    </main>
  );
}