import React, { useState } from "react";

type StatBlock = {
  season_avg: number;
  last5_avg: number;
  projection: number;
  range_low: number;
  range_high: number;
};

type PlayerProjectionResponse = {
  player_id: number;
  season: string;
  games_played: number;
  stats: {
    points: StatBlock;
    assists: StatBlock;
    rebounds: StatBlock;
    threes_made: StatBlock;
    minutes: StatBlock;
  };
};

const PlayerProjection: React.FC = () => {
  const [playerId, setPlayerId] = useState<string>("");
  const [season, setSeason] = useState<string>("2025-26");
  const [data, setData] = useState<PlayerProjectionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjection = async () => {
    if (!playerId) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/player/projection?player_id=${playerId}&season=${encodeURIComponent(
          season
        )}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error fetching projection");
      }

      const json: PlayerProjectionResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Player Projection</h2>
      <p className="card-caption">Blended season + recent form (stats only).</p>

      <div className="form-row">
        <div className="form-field">
          <label>Player ID</label>
          <input
            type="number"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="e.g. 1628983"
          />
        </div>
        <div className="form-field">
          <label>Season</label>
          <input
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="2025-26"
          />
        </div>
        <button
          className="primary-btn"
          onClick={fetchProjection}
          disabled={loading || !playerId}
        >
          {loading ? "Loading..." : "Get Projection"}
        </button>
      </div>

      {error && <p className="error-text">⚠ {error}</p>}

      {data && (
        <div className="projection-results">
          <p className="meta-text">
            Player ID: <strong>{data.player_id}</strong> • Season{" "}
            <strong>{data.season}</strong> • Games{" "}
            <strong>{data.games_played}</strong>
          </p>

          <div className="stat-grid">
            {Object.entries(data.stats).map(([name, stat]) => (
              <div key={name} className="stat-card">
                <h3>{name.toUpperCase()}</h3>
                <p>Season avg: <strong>{stat.season_avg.toFixed(1)}</strong></p>
                <p>Last 5 avg: <strong>{stat.last5_avg.toFixed(1)}</strong></p>
                <p>
                  Projection:{" "}
                  <strong>{stat.projection.toFixed(1)}</strong>{" "}
                  <span className="muted">
                    ({stat.range_low.toFixed(1)} –{" "}
                    {stat.range_high.toFixed(1)})
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerProjection;
