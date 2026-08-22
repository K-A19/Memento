# 🏛️ MEMENTO

### A museum for the moments that made us.

> **What if your memories could speak?**

Memento is an AI-powered personal museum that transforms everyday memories into immersive digital exhibits.

Instead of letting meaningful moments disappear into a camera roll, Memento preserves them as interactive museum pieces — complete with AI-generated stories, themes, curator notes, and voice narration.

Each memory becomes more than a photo.

**It becomes an exhibit.**

---

## Live Demo

### 👉 [Visit Memento](https://memento-hp5i.onrender.com/)

Experience the live application:

**https://memento-hp5i.onrender.com/**

---

## Demo Video

### [▶️ Watch the Memento Demo](https://youtube.com/shorts/UPgfQ6GkkDU?feature=share)

---

# The Problem

We take thousands of photos throughout our lives, but most of them eventually disappear into a camera roll.

A photo might capture a moment, but it doesn't necessarily preserve **why that moment mattered**.

Our memories contain stories, emotions, people, places, and experiences that become harder to remember over time.

Existing photo galleries are designed for **storage and scrolling**.

Memento is designed for **remembering**.

---

# Our Solution

Memento turns personal memories into museum exhibits.

Users can preserve a memory with a photo and basic information. AI then transforms that information into a curated experience by generating themes, organizing the memory into a museum room, and writing a personalized curator's note.

That note is then transformed into realistic narration using ElevenLabs.

The result is an experience where entering a memory feels less like opening a photo and more like **walking into an exhibit.**

---

# Features

## Museum Experience

Memories are organized into an immersive museum-style interface instead of a traditional photo gallery.

Each memory becomes its own exhibit.

---

## Memory Exhibits

Every memory can contain:

- A photograph
- A description
- A date
- A museum room
- AI-generated themes
- An AI-generated curator's note
- AI-generated narration

---

## AI Curation

Memento uses **Google Gemini** to transform raw memory information into structured museum metadata.

AI generates elements such as:

- Curator scripts
- Themes
- Museum rooms/categories
- Descriptions
- Contextual information

This removes the need for users to manually organize every memory.

---

## AI Voice Narration

Memento uses **ElevenLabs** to turn each AI-generated curator script into spoken narration.

When a visitor enters a memory, the curator can begin speaking automatically.

Users can pause and resume the narration at any time.

This transforms the experience from:

> "Look at this photo."

into:

> "Step into this memory."

---

## AI-Generated Themes

AI-generated themes allow memories to be categorized by meaning rather than simply by date.

Examples include:

- Family
- Childhood
- Friendship
- Travel
- School
- Home
- Celebration
- Growth

---

## Museum Rooms

Memories can be organized into different rooms, creating a physical-museum-inspired structure for a digital collection.

These rooms being:

The Beginnings
The People
The Places
Everything In Between

---

# How It Works

Memento combines generative AI, text-to-speech, cloud storage, and an interactive web experience.

```text
                    MEMORY
                       │
                       ▼
                 ┌──────────┐
                 │ Supabase │
                 └────┬─────┘
                      │
                      ▼
                ┌────────────┐
                │   Gemini   │
                │ AI Curator │
                └─────┬──────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Themes       Room      Curator Script
                                  │
                                  ▼
                            ┌───────────┐
                            │ ElevenLabs│
                            └─────┬─────┘
                                  │
                                  ▼
                              MP3 Audio
                                  │
                                  ▼
                         Supabase Storage
                                  │
                                  ▼
                             audio_url
                                  │
                                  ▼
                         MEMENTO EXHIBIT
                                  │
                                  ▼
                           🎙️ CURATOR SPEAKS
```

---

# ⚙️ Architecture

## Frontend

Memento is built with:

* **Next.js**
* **React**
* **TypeScript**
* **CSS**

The frontend handles:

* Museum navigation
* Memory exhibits
* Image display
* Memory metadata
* Audio playback
* Pause/resume controls
* Responsive interaction

---

## Database & Storage

Memento uses **Supabase** for its PostgreSQL database and file storage.

The primary `memories` table contains:

```text
id
title
description
memory_date
image_url
room
themes
curator_script
audio_url
created_at
status
```

Generated audio is stored separately in a Supabase Storage bucket:

```text
memory-audio/
├── memory-id-1.mp3
├── memory-id-2.mp3
└── memory-id-3.mp3
```

The corresponding audio URL is stored in the `audio_url` column of the memory.

---

# AI Workflow

The AI processing pipeline is orchestrated using **n8n**.

```text
Memory
   ↓
Gemini
   ↓
Structured AI Output
   ↓
Code Processing
   ↓
ElevenLabs
   ↓
Generated MP3
   ↓
Supabase Storage
   ↓
Database Update
```

The workflow automatically:

1. Receives memory information.
2. Sends the information to Gemini.
3. Generates structured metadata.
4. Generates a curator script.
5. Sends the curator script to ElevenLabs.
6. Receives the generated audio.
7. Uploads the MP3 to Supabase Storage.
8. Saves the audio URL to the corresponding memory.
9. Marks the memory as ready.

---

# The Curator

One of Memento's core ideas is that memories shouldn't just be **viewed** — they should be **experienced**.

The AI-generated curator script transforms raw information into a narrative.

Instead of simply displaying:

> Summer vacation, 2018.

Memento can create a narrative that provides context and emotion around the moment.

That narrative is then spoken aloud using ElevenLabs.

The result is a digital museum where the exhibits can **tell their own stories.**

---

# Design Philosophy

Memento was intentionally designed to feel more like a museum than a social media feed.

The interface emphasizes:

* Minimalism
* Editorial typography
* Museum-inspired layouts
* Large imagery
* Spacious composition
* Quiet interactions
* Storytelling
* Emotional reflection

Instead of encouraging users to scroll through hundreds of photos, Memento encourages them to **slow down and revisit individual moments.**

---

# 🛠️ Tech Stack

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| **Next.js**       | Web application           |
| **React**         | User interface            |
| **TypeScript**    | Type safety               |
| **CSS**           | Styling and visual design |
| **Supabase**      | Database and storage      |
| **PostgreSQL**    | Memory data               |
| **Google Gemini** | AI-powered curation       |
| **ElevenLabs**    | AI voice narration        |
| **n8n**           | Workflow automation       |
| **Render**        | Deployment                |

---

# Running Locally

## Prerequisites

You'll need:

* Node.js
* npm
* A Supabase project
* A Gemini API key
* An ElevenLabs API key
* n8n

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/memento.git
cd memento
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Database

The core `memories` table can be created with:

```sql
create table public.memories (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  memory_date date null,
  image_url text null,
  room text null,
  themes text[] null,
  curator_script text null,
  audio_url text null,
  created_at timestamp with time zone null default now(),
  status text not null default 'processing'::text,
  constraint memories_pkey primary key (id)
);
```

---

# Audio Storage

Create a Supabase Storage bucket named:

```text
memory-audio
```

Generated narration is stored using the memory UUID:

```text
<memory_id>.mp3
```

This allows every memory to have a unique audio file.

---

# Deployment

Memento is deployed and publicly accessible through **Render**.

### Production URL

**[https://memento-hp5i.onrender.com/](https://memento-hp5i.onrender.com/)**

The production application connects to Supabase for persistent memory data and storage.

---

# Future Security Improvements

The current hackathon version focuses on demonstrating the core Memento experience.

Future versions could include:

* Supabase Authentication
* Private user museums
* Row Level Security
* User-specific memory ownership
* Private storage buckets
* Signed audio URLs
* Secure API routes
* Rate limiting
* User profiles

A future version would associate each memory with a specific user so that every person receives their own private museum.

---

#  Future Roadmap

###  Personal Museums

Give every user their own private collection.

###  Natural Language Search

Allow users to search their museum conversationally:

> "Show me memories from my childhood."

> "Find memories about family vacations."

###  Semantic Memory Search

Use embeddings to search memories based on meaning and emotion rather than exact keywords.

### 🎙️ Interactive Curator

Allow users to ask questions about their memories:

> "Who was there?"

> "What happened next?"

> "Why was this day important?"

### Life Timeline

Create a chronological timeline that lets users travel through their memories.

### AI Exhibit Design

Allow AI to dynamically create rooms, exhibit layouts, and museum descriptions.

### Mobile Experience

Bring the museum experience to mobile devices for on-the-go memory exploration.

---

# Why Memento?

Social media is designed for sharing.

Cloud storage is designed for storing.

Photo galleries are designed for browsing.

**Memento is designed for remembering.**

Our goal is not to create another place to upload photos.

Our goal is to create a place where people can return to the moments that shaped them.

A photograph captures a moment.

**Memento gives that moment a voice.**

---

Built with ❤️ for **Ignition Hacks**.

---

<div align="center">

# MEMENTO

### *Preserve the past. Give it a voice.*

🏛️  🖼️

**[Launch Memento →](https://memento-hp5i.onrender.com/)**

</div>
