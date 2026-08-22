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
  const [processingStep, setProcessingStep] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!image || !title) {
        setMessage("Please add a photo and title.");
        return;
    }

    setLoading(true);
    setMessage("");
    
    setProcessingStep(1);

    const stepTimer1 = setTimeout(() => {
      setProcessingStep(2);
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setProcessingStep(3);
    }, 1800);

    const stepTimer3 = setTimeout(() => {
      setProcessingStep(4);
    }, 2700);

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
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
    }
  }

  return (
    <main className="create-page">

      <header className="create-header">
        <a href="/" className="create-logo">
          MEMENTO
        </a>

        <a href="/museum" className="create-museum-link">
          Enter the museum →
        </a>
      </header>


      <section className="create-intro">

        <p className="create-eyebrow">
          PRESERVE A MEMORY
        </p>

        <h1>
          Every exhibition
          <br />
          begins with a moment.
        </h1>

        <p className="create-subtitle">
          Give us the details. We'll take care of
          the rest.
        </p>

      </section>


      <form
        onSubmit={handleSubmit}
        className="memory-form"
      >

        {/* PHOTO */}

        <section className="form-section">

          <div className="form-label">
            <span>01</span>
            PHOTOGRAPH
          </div>

          <label
            htmlFor="image"
            className={`image-upload ${
              image ? "has-image" : ""
            }`}
          >

            {image ? (
              <div className="image-preview">

                <img
                  src={URL.createObjectURL(image)}
                  alt="Memory preview"
                />

                <div className="image-overlay">
                  Change photograph
                </div>

              </div>
            ) : (
              <div className="upload-empty">

                <span className="upload-symbol">
                  +
                </span>

                <span>
                  Add a photograph
                </span>

                <small>
                  JPG, PNG or WEBP
                </small>

              </div>
            )}

          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files?.[0] || null
              )
            }
            hidden
          />

        </section>


        {/* DETAILS */}

        <section className="form-section">

          <div className="form-label">
            <span>02</span>
            THE MOMENT
          </div>

          <div className="form-fields">

            <div className="field">

              <label htmlFor="title">
                What would you call this moment?
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Graduation"
                required
              />

            </div>


            <div className="field">

              <label htmlFor="date">
                When did it happen?
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

            </div>


            <div className="field field-large">

              <label htmlFor="description">
                Tell us what happened.
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="I had just finished my final exams..."
                rows={5}
              />

            </div>

          </div>

        </section>


        {/* SUBMIT */}

        <section className="preserve-section">

          {loading ? (

            <div className="preserving">

              <p className="preserving-eyebrow">
                PRESERVING YOUR MEMORY
              </p>

              <div className="preserving-loader">
                <span></span>
              </div>

              <div className="preserving-steps">

                <div className={processingStep >= 1 ? "active" : ""}>
                  <span>01</span>
                  Uploading photograph
                </div>

                <div className={processingStep >= 2 ? "active" : ""}>
                  <span>02</span>
                  Finding its place
                </div>

                <div className={processingStep >= 3 ? "active" : ""}>
                  <span>03</span>
                  Writing its story
                </div>

                <div className={processingStep >= 4 ? "active" : ""}>
                  <span>04</span>
                  Adding it to the archive
                </div>

              </div>

            </div>

          ) : message ? (

            <div className="preserved">

              <p className="preserving-eyebrow">
                MEMORY PRESERVED
              </p>

              <h2>
                {title}
              </h2>

              <p>
                Your exhibit has been added to Memento.
              </p>

              <a
                href="/museum"
                className="museum-entry-button"
              >
                Enter the museum →
              </a>

            </div>

          ) : (

            <button
              type="submit"
              className="preserve-button"
              disabled={loading}
            >
              Preserve this memory →
            </button>

          )}

        </section>

      </form>


      <footer className="create-footer">
        <span>MEMENTO</span>
        <span>YOUR PRIVATE ARCHIVE</span>
      </footer>

    </main>
  );
}