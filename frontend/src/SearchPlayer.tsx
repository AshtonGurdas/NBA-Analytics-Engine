import React, { useState } from "react";

type PlayerMatch = {
  id: number;
  full_name: string;
  is_active: boolean;
  team_id?: number;
};

const SearchPlayer: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/player/search?name=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error searching player");
      }

      const json = await res.json();
      setResults(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyId = async (id: number) => {
    try {
      await navigator.clipboard.writeText(String(id));
      alert(`Copied ID: ${id}`);
    } catch {
      alert("Could not copy to clipboard");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Player Search</h2>
      <p className="card-caption">
        Find a player by name and get their ID for projections & hit rates.
      </p>

      <div className="form-row">
        <div className="form-field grow">
          <label>Player Name</label>
          <input
            type="text"
            value={query}
            placeholder="e.g. Shai Gilgeous-Alexander"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className="primary-btn"
          onClick={search}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-text">⚠ {error}</p>}

      {results.length > 0 && (
        <div className="list">
          {results.map((p) => (
            <div key={p.id} className="list-item">
              <div>
                <div className="list-title">{p.full_name}</div>
                <div className="list-sub">
                  ID: {p.id} • {p.is_active ? "Active" : "Retired"}
                </div>
              </div>
              <button className="ghost-btn" onClick={() => copyId(p.id)}>
                Copy ID
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPlayer;
