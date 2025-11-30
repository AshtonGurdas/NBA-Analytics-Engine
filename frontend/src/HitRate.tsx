import React, { useState } from "react";

type HitRateResponse = {
  games: number;
  hit_rate: string;
  over_games: number;
  under_games: number;
};

const statOptions = [
  { label: "Points", value: "PTS" },
  { label: "Rebounds", value: "REB" },
  { label: "Assists", value: "AST" },
  { label: "Threes Made", value: "FG3M" },
  { label: "Minutes", value: "MIN" },
];

const HitRate: React.FC = () => {
  const [playerId, setPlayerId] = useState("");
  const [season, setSeason] = useState("2025-26");
  const [stat, setStat] = useState("PTS");
  const [target, setTarget] = useState<string>("26");
  const [data, setData] = useState<HitRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHitRate = async () => {
    if (!playerId || !target) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const params = new URLSearchParams({
        player_id: playerId,
        stat,
        target,
        season,
      });

      const res = await fetch(
        `http://127.0.0.1:8000/player/hitrate?${params.toString()}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error fetching hit rate");
      }

      const json: HitRateResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Hit Rate</h2>
      <p className="card-caption">
        Shows how often a player has reached a certain stat line. This is{" "}
        <strong>descriptive only</strong>, not advice.
      </p>

      <div className="form-row">
        <div className="form-field">
          <label>Player ID</label>
          <input
            type="number"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Season</label>
          <input
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Stat</label>
          <select
            value={stat}
            onChange={(e) => setStat(e.target.value)}
          >
            {statOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Target Value</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. 26"
          />
        </div>
        <button
          className="primary-btn"
          onClick={fetchHitRate}
          disabled={loading || !playerId || !target}
        >
          {loading ? "Loading..." : "Get Hit Rate"}
        </button>
      </div>

      {error && <p className="error-text">⚠ {error}</p>}

      {data && (
        <div className="stat-card" style={{ marginTop: "1rem" }}>
          <h3>Results</h3>
          <p>Total games: {data.games}</p>
          <p>Success rate: <strong>{data.hit_rate}</strong></p>
          <p>
            Times at or above target: {data.over_games} • Below target:{" "}
            {data.under_games}
          </p>
        </div>
      )}
    </div>
  );
};

export default HitRate;
