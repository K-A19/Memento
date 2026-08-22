import "./home.css";

export default function Home() {
  return (
    <main className="home">
      <nav className="home-nav">
        <span>MEMENTO</span>
        <span>PRIVATE ARCHIVE</span>
      </nav>

      <section className="hero">
        <p className="hero-eyebrow">
          YOUR LIFE IS AN EXHIBITION
        </p>

        <h1>
          Memento
        </h1>

        <p className="hero-tagline">
          Some moments deserve to stay.
        </p>

        <div className="hero-actions">
          <a href="/create" className="primary-button">
            Preserve a Memory
          </a>

          <a href="/museum" className="secondary-button">
            Enter the Museum
          </a>
        </div>
      </section>

      <div className="hero-footer">
        <span>EST. 2026</span>
        <span>PERSONAL COLLECTION</span>
      </div>
    </main>
  );
}