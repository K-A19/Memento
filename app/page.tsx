export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0d0c] text-[#f2efe8] flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm tracking-[0.4em] uppercase text-[#a9a398] mb-6">
          An archive of your life
        </p>

        <h1 className="text-7xl font-serif tracking-tight">
          Memento
        </h1>

        <p className="mt-6 text-xl text-[#b8b3aa]">
          Some moments deserve to stay.
        </p>

        <a
          href="/create"
          className="inline-block mt-10 px-8 py-4 border border-[#f2efe8]/30 rounded-full hover:bg-[#f2efe8] hover:text-[#0d0d0c] transition-all duration-300"
        >
          Create your exhibition
        </a>
      </div>
    </main>
  );
}